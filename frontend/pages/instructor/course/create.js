import { useEffect, useState } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";

const CourseCreate = () => {
  // Add all the fields in order to create a course
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    uploading: false,
    paid: false,
    category: "",
    loading: false,
    imagePreview: "",
  });

  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload an image");
  const [image, setImage] = useState({});

  const handleChange = (event) => {
    // Copy all existing values and whatever was changed.
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Handle image upload.
  const handleImage = (event) => {
    let file = event.target.files[0];
    setPreview(window.URL.createObjectURL(event.target.files[0]));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    // Resize chosen image. The callback gives us the uri of the image
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post("/api/course/upload-image", {
          image: uri,
        });

        console.log("Image upload: ", data);

        // Set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (error) {
        console.log("Something went wrong with uploading the image");
        setValues({ ...values, loading: false });
        toast("Image upload failed.");
      }
    });
  };

  const handleImageRemove = async () => {
    console.log("Image removed ...");
    try {
      setValues({ ...values, loading: true });
      const response = await axios.post("/api/course/remove-image", { image });
      setImage({});
      setPreview("");
      setUploadButtonText("Upload Image.");
      setValues({ ...values, loading: false });
    } catch (error) {
      setValues({ ...values, loading: false });
      console.log("Somthing went wrong: ", error);
    }
  };

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
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
        />
      </div>
      <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(image, null, 4)}</pre>
    </InstructorRoute>
  );
};

export default CourseCreate;
