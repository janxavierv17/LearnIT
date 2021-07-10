/** Reigster.js
 * Collects user's email, name and password to register.
 * Sends it to the backend server to save in to our database.
 */
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Registration = () => {
  const [name, setName] = useState("Jan Xavier Virgen");
  const [email, setEmail] = useState("janv@norec.com.au");
  const [password, setPassword] = useState("janv123");
  const [loading, setLoading] = useState(false);

  const { state, dispatch } = useContext(Context);

  const router = useRouter();
  useEffect(() => {
    if (state.user !== null) {
      toast.error("Unauthorized access.");
      router.push("/");
    }
  }, [state.user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      // We've setup our custom server therefore, our post request should work as intended.
      const { data } = await axios.post(`api/register`, {
        name,
        email,
        password,
      });
      toast.success(
        "Registration success. You have been redirected to Login Page."
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data);
    }

    // console.table({ name, email, password });
    // console.log("REGISTER RESPONSE", data);
  };

  return (
    <>
      <h1 className="square jumbotron text-center bg-primary">
        Registration Page
      </h1>

      <div className="container col-md-4 offset-md-4">
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Enter your name"
            onChange={(event) => setName(event.target.value)}
            value={name}
            type="text"
            className="form-control mb-4 p-4"
            required
          />
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
              disabled={!name || !email || !password || loading}
            >
              {loading ? <SyncOutlined spin /> : "Register"}
            </button>
          </div>
        </form>
        <p className="text-center p-3">
          Already registered?{" "}
          <Link href="/login">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Registration;
