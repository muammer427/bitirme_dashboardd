import { useEffect, useState } from "react";
import axios from "axios";
import ChartBox from "../../components/chartBox/ChartBox";
import PieChartBox from "../../components/pieCartBox/PieChartBox";
import "./home.scss";

const Home = () => {
  const [storeCount, setStoreCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeResponse = await axios.get("http://localhost:5000/magazalar/count");
        setStoreCount(storeResponse.data.count);

        const productResponse = await axios.get("http://localhost:5000/products/count");
        setProductCount(productResponse.data.count);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const chartBoxUser = {
    color: "#8884d8",
    icon: "/userIcon.svg",
    title: "Bağlı Mağazalar",
    dataKey: "storeCount",
    number: storeCount,
    route: "/magazalar", 
  };

  const chartBoxProduct = {
    color: "skyblue",
    icon: "/productIcon.svg",
    title: "Toplam Ürün sayısı",
    dataKey: "productCount",
    number: productCount,
    route: "/products", 
  };

  return (
    <div className="home">
      <div className="box box2">
        <ChartBox {...chartBoxUser} />
      </div>
      <div className="box box4">
        <PieChartBox />
      </div>
      <div className="box box3">
        <ChartBox {...chartBoxProduct} />
      </div>
    
    </div>
  );
};

export default Home;
