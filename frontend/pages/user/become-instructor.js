import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../context";
import { Button } from "antd";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const BecomeInstructor = () => {
  // State
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
  } = useContext(Context);

  const becomeInstructor = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post("/api/make-instructor")
      .then((response) => {
        // The response will give us a link for an onboarding process.
        console.log("Response", response);
        window.location.href = response.data;
      })
      .catch((error) => {
        console.log(
          "Something went wrong with becoming an instructor: ",
          error.response.status
        );
        toast("Stripe onboarding failed. Check the error.");
        setLoading(false);
      });
    // console.log("Button is clicked.");
  };
  return (
    <>
      <h1 className="square jumbotron text-center bg-primary">
        Becoming an Instructor
      </h1>

      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Setup payout to publish courses on Edemy</h2>
              <p className="lead text-warning">
                Edemy partners with stripe to transfer your earnings to your
                bank account.
              </p>
              <Button
                onClick={becomeInstructor}
                className="mb-3"
                type="primary"
                size="large"
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                disabled={
                  (user && user.role && user.role.includes("Instructor")) ||
                  loading
                }
                block
              >
                {loading ? "Processing ... " : "Payout Setup"}
              </Button>
              <p className="lead">
                You will be redirected to stripe to complete an onboarding
                process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
