import { useState, useEffect } from "react";
import axios from "axios";
import "./Products.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/AddProduct";
import Edit from "../../components/edit/EditProduct";
import { GridColDef } from "@mui/x-data-grid";


const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "img",
    headerName: "Resim",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.img || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "barcode",
    type: "string",
    headerName: "Barkod No",
    width: 150,
  },
  {
    field: "title",
    type: "string",
    headerName: "Başlık",
    width: 250,
  },
  {
    field: "description",
    headerName: "Ürün Açıklaması",
    width: 200,
    type: "string",
  },
  {
    field: "productcode",
    type: "string",
    headerName: "Ürün Kodu",
    width: 200,
  },
  {
    field: "brand",
    headerName: "Marka",
    type: "string",
    width: 200,
  },
  {
    field: "category",
    headerName: "Kategori",
    width: 200,
    type: "string",
  },
  {
    field: "stock",
    headerName: "Stok Miktarı",
    width: 150,
    type: "number",
  },
  {
    field: "desi",
    headerName: "Desi Miktarı",
    width: 200,
    type: "string",
  },
  {
    field: "currency",
    headerName: "Para Birimi",
    width: 200,
    type: "string",
  },
  {
    field: "listprice",
    headerName: "Liste Fiyatı",
    width: 200,
    type: "string",
  },
  {
    field: "saleprice",
    headerName: "Satış Fiyatı",
    width: 200,
    type: "string",
  },
  {
    field: "cargo",
    headerName: "Kargo Şirketi",
    width: 200,
    type: "string",
  },
  {
    field: "vatrate",
    headerName: "KDV Oranı",
    width: 200,
    type: "string",
  },
  {
    field: "categoriAttributes",
    headerName: "Kategori Özellikleri",
    width: 200,
    type: "string",
  },
];

const Products = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [products, setProducts] = useState([]);
  const [editData, setEditData] = useState({});

  const refreshData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="products">
      <div className="info">
        <h1>Ürünler</h1>
        <button onClick={() => setOpen(true)}>Yeni ürün ekle</button>
      </div>
      <DataTable 
        slug="products"
        columns={columns} 
        rows={products} 
        refreshData={refreshData}
        setEditData={setEditData}
        setOpenEdit={setOpenEdit}
      />
      
      {open && <Add slug="Ürün" columns={columns} setOpen={setOpen} />}
      {openEdit && <Edit slug="Ürün" columns={columns} setOpen={setOpenEdit} editData={editData} refreshData={refreshData} />}
    </div>
  );
};

export default Products;
