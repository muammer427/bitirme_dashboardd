import { useState, useEffect } from "react";
import axios from "axios";
import { GridColDef } from "@mui/x-data-grid";
import "./magazalar.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/AddMagaza";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "MagazaIsim",
    type: "string",
    headerName: "Mağaza İsmi",
    width: 300,
  },
  {
    field: "ApiKey",
    type: "string",
    headerName: "API Key",
    width: 300,
  },
  {
    field: "ApiSecret",
    type: "string",
    headerName: "API Secret",
    width: 300,
  },
  {
    field: "SaticiId",
    type: "string",
    headerName: "Satıcı Id",
    width: 300,
  },
];


const Magazalar = () => {
  const [open, setOpen] = useState(false);
  const [magazalar, setMagazalar] = useState([]);

  useEffect(() => {
    const fetchMagazalar = async () => {
      try {
        const response = await axios.get('http://localhost:5000/magazalar');
        console.log('Magazalar fetched:', response.data);
        setMagazalar(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchMagazalar();
  }, []);

  return (
    <div className="products">
      <div className="info">
        <h1>Mağazalar</h1>
        <button onClick={() => setOpen(true)}>Yeni Mağaza ekle</button>
      </div>
      <DataTable slug="magazalar" columns={columns} rows={magazalar} />
      
      {open && <Add slug="magaza" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Magazalar;
