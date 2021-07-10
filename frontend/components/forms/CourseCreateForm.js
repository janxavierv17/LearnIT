import { Select, Button } from "antd";
const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
}) => {
  const children = [];
  for (let i = 9.99; i <= 101.99; i++) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group pb-3">
        <input
          onChange={handleChange}
          className="form-control"
          placeholder="Name"
          value={values.name}
          type="text"
          name="name"
        />
      </div>

      <div className="form-group">
        <textarea
          onChange={handleChange}
          className="form-control"
          value={values.description}
          name="description"
          cols="7"
          rows="7"
        ></textarea>
      </div>

      <div className="row pt-3 pb-3">
        <div className="col-8">
          <div className="form-group">
            <Select
              style={{ width: "100%" }}
              placeholder="Free or Paid ?"
              size="large"
              onChange={(value) =>
                // Toggles paid from true to false and vice versa
                setValues({ ...values, paid: !values.paid })
              }
            >
              <Option value={true}>Paid</Option>
              <Option value={false}>Free</Option>
            </Select>
          </div>
        </div>
        {values.paid && (
          <div className="col">
            <div className="form-group">
              <Select
                style={{ width: "100%" }}
                onChange={(value) => setValues({ ...values, price: value })}
                defaultValue="$9.99"
                tokenSeparators={[,]}
                size="large"
              >
                {children}
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="form-group pb-3">
        <input
          onChange={handleChange}
          className="form-control"
          placeholder="Category"
          value={values.category}
          type="text"
          name="category"
        />
      </div>

      <div className="form-row pb-3">
        <div className="col">
          <div className="form-group">
            <label className="btn w-50 btn-outline-secondary text-left">
              {values.loading ? "Uploading ..." : "Upload an Image"}
              <input
                type="file"
                name="image"
                onChange={handleImage}
                accept="image/*"
                hidden
              />
            </label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Button
            type="primary"
            size="large"
            shape="round"
            onClick={handleSubmit}
            className="btn btn-primary"
            loading={values.loading}
            disabled={values.loading || values.uploading}
          >
            {values.loading ? "Saving ... " : "Save & Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CourseCreateForm;
