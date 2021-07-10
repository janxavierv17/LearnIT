import { useEffect, useState } from "react";
import Link from "next/link";

const InstructorNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    console.log("Process Browser ", process.browser);
    console.log("Pathname ", window.location.pathname);
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <>
      <div
        style={{ backgroundColor: "lightblue" }}
        className="nav nav-pills flex-column mt-2"
      >
        <Link href="/instructor">
          <a className={`nav-link ${current === "/instructor" && "active"}`}>
            Dashboard
          </a>
        </Link>
      </div>
      <div
        style={{ backgroundColor: "lightblue" }}
        className="nav nav-pills flex-column mt-2"
      >
        <Link href="/instructor/course/create">
          <a
            className={`nav-link ${
              current === "/instructor/course/create" && "active"
            }`}
          >
            Create Course
          </a>
        </Link>
      </div>
    </>
  );
};
export default InstructorNav;
