import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const forgotPassword = () => {
  // State
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Context
  const { state } = useContext(Context);

  // Router
  const router = useRouter();

  // Redirect if the user is already logged in.
  useEffect(() => {
    if (state.user !== null) {
      router.push("/");
    }
  }, [state.user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/forgot-password", { email });
      setSuccess(true);
      toast("We've sent you the secret code. Please enter it in the form.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast(error.response.data);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    // console.log(email, code, newPassword);
    // return;
    try {
      setLoading(true);
      const { data } = await axios.post("/api/reset-password", {
        email,
        code,
        newPassword,
      });
      setEmail(""), setCode(""), setNewPassword(""), setLoading(false);
      toast("To login, please use your new password.");
      setSuccess(false);
    } catch (error) {
      setLoading(false);
      toast(error.response.data);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">
        Reset Password
      </h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={success ? handleResetPassword : handleSubmit}>
          <input
            className="form-control mb-4 p-4"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            placeholder="Enter your email address."
            type="email"
            value={email}
            required
          />
          {success && (
            <>
              <input
                className="form-control mb-4 p-4"
                onChange={(event) => {
                  setCode(event.target.value);
                }}
                placeholder="Enter the code."
                type="text"
                value={code}
                required
              />

              <input
                className="form-control mb-4 p-4"
                onChange={(event) => {
                  setNewPassword(event.target.value);
                }}
                placeholder="Enter new password."
                type="password"
                value={newPassword}
                required
              />
            </>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-block p-2"
            disabled={loading || !email}
          >
            {loading ? <SyncOutlined spin /> : "Reset Password"}
          </button>
        </form>
      </div>
    </>
  );
};
export default forgotPassword;
