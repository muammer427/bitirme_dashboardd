import { useState, useEffect } from "react";
import axios from "axios";
import "./Products.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/AddProduct";
import { GridColDef } from "@mui/x-data-grid";

// Define Product interface
interface Product {
  id: string;
  img: string; 
  barcode: string;
  title: string;
  description: string;
  productcode: string;
  brand: string;
  category: string;
  stock: number;
  desi: string;
  currency: string;
  listprice: string;
  saleprice: string;
  cargo: string;
  vatrate: string;
}

const Products = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log('Fetching products from the server...');
      try {
        const response = await axios.get('http://localhost:5000/products');
        console.log('Products fetched:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const columns: CustomGridColDef[] = [
    { field: "id", headerName: "ID", width: 90, type: "string" },
    {
      field: "img",
      headerName: "Ürün Resmi",
      width: 200,
      type: "file",
      renderCell: (params: GridCellParams) => (
        <img src={`../../../backend/uploads/${params.value}`} alt="Product" style={{ width: 100, height: 100, objectFit: 'cover' }} />
      ),
    },
    { field: "barcode", headerName: "Barkod No", width: 150, type: "string" },
    { field: "title", headerName: "Başlık", width: 250, type: "string" },
    { field: "description", headerName: "Ürün Açıklaması", width: 200, type: "string" },
    { field: "productcode", headerName: "Ürün Kodu", width: 200, type: "string" },
    { field: "brand", headerName: "Marka", width: 200, type: "singleSelect", options: brandOptions },
    { field: "category", headerName: "Kategori", width: 200, type: "singleSelect", options: categoryOptions },
    { field: "stock", headerName: "Stok Miktarı", width: 150, type: "number" },
    { field: "desi", headerName: "Desi Miktarı", width: 200, type: "string" },
    { field: "currency", headerName: "Para Birimi", width: 200, type: "string" },
    { field: "listprice", headerName: "Liste Fiyatı", width: 200, type: "string" },
    { field: "saleprice", headerName: "Satış Fiyatı", width: 200, type: "string" },
    { field: "cargo", headerName: "Kargo Şirketi", width: 200, type: "singleSelect", options: ["Sürat Kargo", "Aras Kargo", "MNG Kargo"] },
    { field: "vatrate", headerName: "KDV Oranı", width: 200, type: "singleSelect", options: ["1", "5", "10", "20"] },
  ];

  return (
    <div className="products">
      <div className="info">
        <h1>Ürünler</h1>
        <button onClick={() => setOpen(true)}>Yeni ürün ekle</button>
      </div>
      <DataTable slug="Ürünler" columns={columns} rows={products} />
      
      {open && <Add slug="Ürün" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Products;
