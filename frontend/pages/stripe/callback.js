import { useContext, useEffect } from "react";
import { Context } from "../../context";
import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";
const StripeCallback = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    if (user) {
      axios.post("/api/get-account-status").then((response) => {
        dispatch({
          type: "LOGIN",
          payload: response.data,
        });

        // Save the data to local storage
        window.localStorage.setItem("user", JSON.stringify(response.data));
        window.location.href = "/instructor";

        // console.log("Response", response.data);
      });
    }
  }, [user]);

  return (
    <SyncOutlined
      className="d-flex justify-content-center display-1 text-danger p-5"
      spin
    />
  );
};

export default StripeCallback;
