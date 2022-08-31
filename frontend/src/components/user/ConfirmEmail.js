import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmEmail, reset } from "../../features/auth/authSlice";

function ConfirmEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email, token } = useParams();
  const { isError, message } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    console.log(message);

    dispatch(confirmEmail({ email, token }));

    if (message) {
      toast.success(message);
    }

    dispatch(reset());
    navigate("/login");
  }, [isError, message, dispatch, navigate, email, token]);
  return <div></div>;
}

export default ConfirmEmail;
