import { useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";

const InstructorIndex = () => {
  return (
    <InstructorRoute>
      <h1 className="square jumbotron text-center bg-primary">
        Instructor Dashboard
      </h1>
    </InstructorRoute>
  );
};

export default InstructorIndex;
