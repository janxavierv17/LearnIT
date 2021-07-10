import { useEffect, useState } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
const CourseCreate = () => {
  // Add all the fields in order to create a course
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    uploading: false,
    paid: true,
    category: "",
    loading: false,
    imagePreview: "",
  });

  const handleChange = (event) => {
    // Copy all existing values and whatever was changed.
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Handle image upload.
  const handleImage = () => {};

  // Submit all instructor entries to our server
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
  };

  return (
    <InstructorRoute>
      <h1 className="square jumbotron text-center bg-primary"></h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
        />
      </div>
      <pre>{JSON.stringify(values, null, 4)}</pre>
    </InstructorRoute>
  );
};

export default CourseCreate;
