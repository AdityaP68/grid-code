import { useState } from "react";

const DetailForm = ({ data, node }) => {
  const [formData, setFormData] = useState({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    field5: "",
    field6: "",
    field7: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

    // Close the expanded row after submission
    node.setExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "10px", border: "1px solid #ddd", background: "#ffffef" }}>
      <h4>Detail Form for {data.athlete}</h4>
      {Object.keys(formData).map((field, index) => (
        <div key={index} style={{ marginBottom: "8px" }}>
          <label>
            {`Field ${index + 1}: `}
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
      ))}
      <button type="submit" style={{ marginTop: "10px" }}>
        Submit
      </button>
    </form>
  );
};

export default DetailForm;
