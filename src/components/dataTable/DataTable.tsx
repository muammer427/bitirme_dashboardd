import React from "react";
<<<<<<< HEAD
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridToolbar,
} from "@mui/x-data-grid";
import axios from "axios";
import "./dataTable.scss";
import { Link } from "react-router-dom";
=======
import { GridColDef, GridToolbar, DataGrid, GridRowModel } from "@mui/x-data-grid";
import axios from "axios";
import "./dataTable.scss";
>>>>>>> 2a009ac31a51098a953caa3f06a6dec08611a60b

type Props = {
  columns: GridColDef[];
  rows: any[];
  slug: string;
  refreshData: () => void;
  setEditData: (data: any) => void;
  setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

<<<<<<< HEAD
const DataTable: React.FC<Props> = ({ columns, rows, slug, refreshData, setEditData, setOpenEdit }) => {
=======
const DataTable: React.FC<Props> = ({ columns, rows, refreshData, setEditData, setOpenEdit }) => {
>>>>>>> 2a009ac31a51098a953caa3f06a6dec08611a60b
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      console.log("Item deleted successfully");
      refreshData(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleRowEdit = async (newRow: GridRowModel) => {
    const { id, ...updatedFields } = newRow;
    try {
      await axios.put(`http://localhost:5000/products/${id}`, updatedFields);
      console.log("Item updated successfully");
      refreshData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating item:", error);
    }
    return newRow;
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
<<<<<<< HEAD
          <Link to={`/${slug}/${params.row.id}`}>
            <img src="/view.svg" alt="View" />
          </Link>
          <div className="edit" onClick={() => { setEditData(params.row); setOpenEdit(true); }}>
            <img src="/edit.svg" alt="Edit" />
=======
          
          <div className="edit" onClick={() => { setEditData(params.row); setOpenEdit(true); }}>
          <img src="/view.svg" alt="View" />
>>>>>>> 2a009ac31a51098a953caa3f06a6dec08611a60b
          </div>
          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="/delete.svg" alt="Delete" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={rows}
        columns={[...columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
        processRowUpdate={handleRowEdit}
        onProcessRowUpdateError={(error) => {
          console.error("Error processing row update:", error);
        }}
      />
    </div>
  );
};

export default DataTable;
