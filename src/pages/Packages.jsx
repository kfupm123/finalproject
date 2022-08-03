import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { RiDeleteBinLine } from "react-icons/ri";
import { deletePackage, updatePackageStatus } from "../actions/package/package";
import { usePackages } from "../customhooks/usePackages";
import { getPackages } from "../actions/package/package";
import { useSelector } from "react-redux";
import { roles } from "../actions/constants";
import { Navigate } from "react-router";
import moment from "moment";
const Packages = () => {
  const [packages, setPackages] = useState([]);
  const User = useSelector((state) => state.user);
  usePackages(setPackages);
  const fetchdata = async () => {
    await getPackages()
      .then((res) => {
        if (res && res.status === 200) {
          if (res.data.packages && res.data.packages.length > 0) {
            setPackages(res.data.packages);
          }
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  const handleDelete = async (pkg) => {
    if (User.role !== roles.ADMIN)
      return toast.error("You can't perform this action.");
    let res = window.confirm(`Do you really want to delete ${pkg.id}`);
    if (res) {
      await deletePackage(pkg.id)
        .then(() => {
          toast.success(`${pkg.id} deleted successfully`);
          fetchdata();
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };
  const handleChange = async (e, pkg) => {
    if (User.role !== roles.ADMIN)
      return toast.error("You can't perform this action.");
    await updatePackageStatus(pkg.id, { status: e.target.value })
      .then(() => {
        toast.success(`${pkg.id} updated successfully`);
        fetchdata();
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  if (!User.isLoggedIn) return <Navigate to="/login" />;
  return (
    <div>
      <Navbar />
      <h2 style={{ padding: "1rem" }} className="text-center">
        Packages
      </h2>
      <div className="table-responsive tableContainer">
        <table className="table table-responsive \">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">EDD</th>
              <th scope="col">RTA</th>
              <th scope="col">Priority</th>
              <th scope="col">Status</th>
              <th scope="col">Customer</th>
              <th scope="col">Contact</th>
              <th scope="col">Assignee</th>
              <th scope="col">Delete</th>
              {/* <th scope="col">Edit</th> */}
            </tr>
          </thead>
          <tbody>
            {packages &&
              packages
                .filter((pkg) =>
                  User.role === roles.DRIVER
                    ? pkg.deliveredBy._id === User._id
                    : true
                )
                .map((pkg, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{pkg.id}</th>
                      <td>
                        {pkg.EDD
                          ? moment(new Date(pkg.EDD)).format("DD/MM/YYYY")
                          : "–"}
                      </td>
                      <td>{pkg.RTA ? pkg.RTA : "–"}</td>
                      <td>{pkg.priority ? pkg.priority : "–"}</td>
                      <td>
                        {
                          <div className="input_field select_option">
                            <select
                              value={pkg.status ? pkg.status : "-"}
                              onChange={(e) => handleChange(e, pkg)}
                            >
                              <option value="inWarehouse">In Warehouse</option>
                              <option value="inTransit">In Transit</option>
                              <option value="delivered">Delivered</option>
                              <option value="missDelivered">
                                Missdelivered
                              </option>
                            </select>
                            <div className="select_arrow"></div>
                          </div>
                        }
                      </td>
                      <td>
                        {pkg.customer
                          ? pkg.customer.name
                            ? pkg.customer.name
                            : "–"
                          : "-"}
                      </td>
                      <td>
                        {pkg.customer
                          ? pkg.customer.contact
                            ? pkg.customer.contact
                            : "–"
                          : "-"}
                      </td>
                      <td>
                        {pkg.deliveredBy
                          ? pkg.deliveredBy.firstName &&
                            pkg.deliveredBy.firstName
                            ? `${pkg.deliveredBy.firstName} ${pkg.deliveredBy.lastName}`
                            : "–"
                          : "-"}
                      </td>
                      <td>
                        <div
                          className="table_action table_action_del"
                          onClick={() => handleDelete(pkg)}
                        >
                          <RiDeleteBinLine />
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Packages;
