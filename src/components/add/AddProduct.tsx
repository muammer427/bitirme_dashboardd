import React, { useState } from "react";
import axios from "axios";
import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Add = (props: Props) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<string | null>(null); // State for notification

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log('Sending form data:', formData);

      // Send form data to add new product
      const addProductResponse = await axios.post('http://localhost:5000/add-product', formData);
      console.log("Data saved successfully:", addProductResponse.data);

      // Set notification
      setNotification("Product added successfully!");

      // Close the modal after a short delay to show the notification
      setTimeout(() => {
        props.setOpen(false);
        setNotification(null); // Clear notification after modal is closed
      }, 2000);
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Yeni {props.slug}</h1>
        <form onSubmit={handleSubmit}>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column) => (
              <div className="item" key={column.field}>
                <label>{column.headerName}</label>
                <input
                  type={column.type === 'number' ? 'number' : 'text'}
                  name={column.field}
                  placeholder={column.field}
                  onChange={handleChange}
                />
              </div>
            ))}
          <button type="submit">Gönder</button>
        </form>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default Add;
