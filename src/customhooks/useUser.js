import { useEffect } from "react";
import { checkLogin } from "../actions/auth/auth";
import { authConstants } from "../actions/constants";
import { useDispatch } from "react-redux";
export const useUser = (setLoading) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    let mounted = true;
    if (token) {
      setLoading(true);
      checkLogin()
        .then((res) => {
          if (mounted) {
            setLoading(false);
            dispatch({
              type: authConstants.LOGIN,
              payload: {
                _id: res.data.user._id,
                id: res.data.user.id,
                name: res.data.user.name,
                role: res.data.user.role,
                firstName: res.data.user.firstName,
                lastName: res.data.user.lastName,
                score: res.data.user.score,
              },
            });
          }
        })
        .catch((err) => {
          if (mounted) {
            setLoading(false);
            dispatch({
              type: authConstants.LOGOUT,
            });
          }
          localStorage.clear();
        });
    }
    return () => (mounted = false);
  }, []);
};
