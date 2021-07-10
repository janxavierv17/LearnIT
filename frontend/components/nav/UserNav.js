import { useEffect, useState } from "react";
import Link from "next/link";

const UserNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    console.log("Process Browser ", process.browser);
    console.log("Pathname ", window.location.pathname);
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div
      style={{ backgroundColor: "lightblue" }}
      className="nav nav-pills flex-column"
    >
      <Link href="/user">
        <a className={`nav-link ${current === "/user" && "active"}`}>
          Dashboard
        </a>
      </Link>
    </div>
  );
};
export default UserNav;
