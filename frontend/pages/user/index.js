import { useState, useContext } from "react";
import { Context } from "../../context/index";
import UserRoute from "../../components/routes/UserRoute";
const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);

  return (
    <UserRoute>
      <h1 className="jumbotron text-center square">
        {/* User Dashboard */}

        {/* <pre>{JSON.stringify(user)}</pre> */}
      </h1>
    </UserRoute>
  );
};

export default UserIndex;
