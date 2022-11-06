import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";

import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

import { Product } from "../types";
import { toast } from "react-toastify";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const {data}= await axios.get(`${process.env.REACT_APP_API}/products`);
      if(!data){
        return toast.error("No products found");
      }
      setProducts(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <h1>Featured Products</h1>
      <div className="products">
        <Row>
          {products && (
            products.map((product: Product) => {
              return (
                <Col sm={6} md={4} lg={3} key={product.slug}>
                  <ProductCard product={product} />
                </Col>
              );
            })
          ) }
        </Row>
      </div>

      
    </>
  );
};

export default HomePage;
