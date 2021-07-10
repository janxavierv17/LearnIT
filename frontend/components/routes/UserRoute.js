import { useEffect, useState, React } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import UserNav from "../nav/UserNav";

const UserRoute = ({ children }) => {
  // State
  const [ok, setOk] = useState(false);

  const router = useRouter();
  useEffect(() => {
    // Call the function to run.
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/current-user");
      if (data.ok) {
        setOk(true);
      }
    } catch (error) {
      console.log("Something went wrong with /user component ", error);
      setOk(false);
      router.push("/login");
    }
  };

  return (
    <>
      {!ok ? (
        <SyncOutlined
          className="d-flex justify-content-center display-1 text-primary p-5"
          spin
        />
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <UserNav />
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserRoute;
