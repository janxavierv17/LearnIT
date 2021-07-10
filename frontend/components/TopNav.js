import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  AppstoreOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Context } from "../context/index";
import { useRouter } from "next/router";

// Destructure the component that we need from antd
const { Item, SubMenu, ItemGroup } = Menu;

// The page's navigation bar
const TopNav = () => {
  const [current, setCurrent] = useState("");

  const router = useRouter();

  const { state, dispatch } = useContext(Context);

  // Logout
  const logout = async () => {
    dispatch({ type: "LOGOUT" });

    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/");
  };

  useEffect(() => {
    console.log("Process Browser ", process.browser);
    console.log("Pathname ", window.location.pathname);
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <Menu
      className="d-flex p-2 mb-2"
      mode="horizontal"
      selectedKeys={[current]}
    >
      <Item
        key="/"
        onClick={(event) => setCurrent(event.key)}
        icon={<AppstoreOutlined />}
      >
        <Link href="/">
          <a>App</a>
        </Link>
      </Item>

      {state.user &&
      state.user.role &&
      state.user.role.includes("Instructor") ? (
        <Item
          className="me-auto"
          key="/instructor/course/create"
          onClick={(event) => setCurrent(event.key)}
          icon={<CarryOutOutlined />}
        >
          <Link href="/instructor/course/create">
            <a>Create Course</a>
          </Link>
        </Item>
      ) : (
        <Item
          className="me-auto"
          key="/user/become-instructor"
          onClick={(event) => setCurrent(event.key)}
          icon={<TeamOutlined />}
        >
          <Link href="/user/become-instructor">
            <a>Become an Instructor</a>
          </Link>
        </Item>
      )}

      {state.user && state.user.role && state.user.role.includes("Instructor") && (
        <Item
          key="/instructor"
          onClick={(event) => setCurrent(event.key)}
          icon={<TeamOutlined />}
        >
          <Link href="/instructor">
            <a>Instructor</a>
          </Link>
        </Item>
      )}

      {state.user === null && (
        <>
          <Item
            key="/register"
            onClick={(event) => setCurrent(event.key)}
            icon={<UserAddOutlined />}
          >
            <Link href="/register">
              <a>Register</a>
            </Link>
          </Item>

          <Item
            key="/login"
            onClick={(event) => setCurrent(event.key)}
            icon={<LoginOutlined />}
          >
            <Link href="/login">
              <a>Login</a>
            </Link>
          </Item>
        </>
      )}

      {state.user !== null && (
        <SubMenu
          key="SubMenu"
          icon={<CoffeeOutlined />}
          title={state.user.name}
        >
          <ItemGroup>
            <Item key="/user">
              <Link href="/user">
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item key="/logout" onClick={logout}>
              <Link href="/">
                <a>Logout</a>
              </Link>
            </Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
