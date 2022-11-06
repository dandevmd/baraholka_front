import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Col, Row } from "react-bootstrap";

import { Product } from "../types";

import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsByCategory();
  }, [category]);

  const fetchProductsByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/products/category/${category}`
      );
      if (!data) {
        setLoading(false);
        toast.error("Products in this category are not available");
        return;
      }
      setProducts(data);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <h1>{category}</h1>
      <div className="products">
        <Row>
          {products &&
            products.map((product: Product) => {
              return (
                <Col sm={6} md={4} lg={3} key={product.slug}>
                  <ProductCard product={product} />
                </Col>
              );
            })}
        </Row>
      </div>
    </>
  );
};

export default CategoryPage;
