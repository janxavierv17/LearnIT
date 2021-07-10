/** Reigster.js
 * Collects user's email, name and password to register.
 * Sends it to the backend server to save in to our database.
 */
import { useState, useContext, useEffect } from "react";
import { Context } from "../context/index";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("janv@norec.com.au");
  const [password, setPassword] = useState("janv123");
  const [loading, setLoading] = useState(false);

  // State
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    if (state.user !== null) {
      router.push("/");
    }
  }, [state.user]);
  // Router
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      // We've setup our custom server therefore, our post request should work as intended.
      const { data } = await axios.post(`api/login`, {
        email,
        password,
      });

      dispatch({
        type: "LOGIN",
        payload: data,
      });

      // Save in a local storage
      window.localStorage.setItem("user", JSON.stringify(data));
      router.push("/");
      console.log("Login response: ", data);

      // setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data);
    }

    // console.table({ name, email, password });
    // console.log("REGISTER RESPONSE", data);
  };

  return (
    <>
      <h1 className="square jumbotron text-center bg-primary">Login Page</h1>

      <div className="container col-md-4 offset-md-4">
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Enter your email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            type="text"
            className="form-control mb-4 p-4"
            required
          />
          <input
            placeholder="Enter your password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            type="password"
            className="form-control mb-4 p-4"
            required
          />
          <div className="d-grid gap-2 col-6 mx-auto">
            <button
              type="submit"
              className="btn btn-outline-primary"
              disabled={!email || !password || loading}
            >
              {loading ? <SyncOutlined spin /> : "Login"}
            </button>
          </div>
        </form>

        <p className="text-center pt-3">
          Don't have an account yet?{" "}
          <Link href="/login">
            <a>Register</a>
          </Link>
        </p>

        <p className="text-center">
          Forgot your password?{" "}
          <Link href="/forgot-password">
            <a>Reset Password</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
