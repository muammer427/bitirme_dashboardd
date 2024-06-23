import React, { useState, useEffect } from "react";
import axios from "axios";
import { GridColDef } from "@mui/x-data-grid";
import "./EditProduct.scss";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData: any;
  refreshData: () => void;
};

const Edit: React.FC<Props> = ({ slug, columns, setOpen, editData, refreshData }) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
<<<<<<< HEAD
  const [notification, setNotification] = useState<string | null>(null);
=======
>>>>>>> 2a009ac31a51098a953caa3f06a6dec08611a60b

  useEffect(() => {
    setFormData(editData);
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log('Sending form data:', formData);

      // Send form data to update product
      const updateProductResponse = await axios.put(`http://localhost:5000/update-product/${formData.id}`, formData);
      console.log("Data updated successfully:", updateProductResponse.data);

<<<<<<< HEAD
      // Show notification
      setNotification("Ürün başarıyla güncellendi");

      // Close the modal after a short delay to show the notification
      setTimeout(() => {
        setOpen(false);
        setNotification(null); // Clear notification after modal is closed
      }, 2000);
=======
      // Close the modal
      setOpen(false);
>>>>>>> 2a009ac31a51098a953caa3f06a6dec08611a60b

      // Refresh the product list
      refreshData();
    } catch (error) {
      console.error("Error updating data", error);
    }
  };

  return (
    <div className="edit">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>
          X
        </span>
        <h1>{slug} Düzenle</h1>
        <form onSubmit={handleSubmit}>
          {columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column) => (
              <div className="item" key={column.field}>
                <label>{column.headerName}</label>
                <input
                  type={column.type === 'number' ? 'number' : 'text'}
                  name={column.field}
                  placeholder={column.headerName}
                  value={formData[column.field] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
          <button type="submit">Güncelle</button>
        </form>
<<<<<<< HEAD
        {notification && <div className="notification">{notification}</div>}
=======
>>>>>>> 2a009ac31a51098a953caa3f06a6dec08611a60b
      </div>
    </div>
  );
};

export default Edit;
