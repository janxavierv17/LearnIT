// Components
import TopNav from "../components/TopNav";
import { ToastContainer } from "react-toastify";
import { Provider } from "../context/index";

import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "react-toastify/dist/ReactToastify.css";
import "../public/css/styles.css";

// This component will make our Bootstrap and Ant Design available to our components.
function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      {/* To show toast notifications on to our app. */}
      <ToastContainer position="top-right" />
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
