import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";

// Define a type that extends GridColDef for custom column definitions
interface CustomGridColDef extends Omit<GridColDef, "field" | "type"> {
  field: string;
  type: "string" | "number" | "singleSelect" | "file"; 
  options?: string[];
}

// Define a type for form data values
type FormDataValues = {
  [key: string]: string | File | null;
};

// Define props for the AddProduct component
type Props = {
  slug: string;
  columns: CustomGridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

<<<<<<< HEAD
const AddProduct: React.FC<Props> = ({ slug, columns, setOpen }) => {
  // Initialize form data state
  const initialFormData: FormDataValues = {};
  columns.forEach((column) => {
    initialFormData[column.field] = column.type === "file" ? null : "";
  });
  const [formData, setFormData] = useState<FormDataValues>(initialFormData);
=======
const Add = (props: Props) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
>>>>>>> 2a009ac31a51098a953caa3f06a6dec08611a60b
  const [notification, setNotification] = useState<string | null>(null); // State for notification

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name && e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      // Exclude "id" field from formDataToSend
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (value !== null && key !== "id") {
          formDataToSend.append(key, value instanceof File ? value : value.toString());
        }
      });

      console.log("Sending form data:", formDataToSend);

      const addProductResponse = await axios.post(
        "http://localhost:5000/add-product",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Data saved successfully:", addProductResponse.data);

      // Set notification
      setNotification("Product added successfully!");

      // Close the modal after a short delay to show the notification
      setTimeout(() => {
<<<<<<< HEAD
        setOpen(false);
=======
        props.setOpen(false);
>>>>>>> 2a009ac31a51098a953caa3f06a6dec08611a60b
        setNotification(null); // Clear notification after modal is closed
      }, 2000);
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>
          X
        </span>
        <h1>Yeni {slug}</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {columns
            .filter((item) => item.field !== "id")
            .map((column) => (
              <div className="item" key={column.field}>
                <label>{column.headerName}</label>
                {column.type === "singleSelect" ? (
                  <select
                    name={column.field}
                    value={formData[column.field]?.toString() || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select {column.headerName}</option>
                    {column.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : column.type === "file" ? (
                  <input
                    type="file"
                    accept="image/*"
                    name={column.field} // Ensure name attribute matches the field expected by Multer
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type={column.type === "number" ? "number" : "text"}
                    name={column.field}
                    placeholder={column.headerName}
                    value={formData[column.field]?.toString() || ""}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          <button type="submit">Gönder</button>
        </form>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default AddProduct;
