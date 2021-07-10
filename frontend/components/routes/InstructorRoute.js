import { useEffect, useState, React } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import InstructorNav from "../nav/InstructorNav";

const InstructorRoute = ({ children }) => {
  // State
  const [ok, setOk] = useState(false);

  const router = useRouter();
  useEffect(() => {
    // Call the function to run.
    fetchInstructor();
  }, []);

  const fetchInstructor = async () => {
    try {
      const { data } = await axios.get("/api/current-instructor");
      if (data.ok) {
        setOk(true);
      }
    } catch (error) {
      console.log("Something went wrong with /instructor component ", error);
      setOk(false);
      router.push("/");
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
              <InstructorNav />
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorRoute;
