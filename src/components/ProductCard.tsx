import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

import Rating from "../components/RatingComp";

import { useCartContext } from "../context/CartContext";
import { Product, CartItem } from "../types";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: Product }) => {
  const { cart } = useCartContext();
  const itemInCart =
    cart &&
    cart.length > 0 &&
    cart.find((item: Product) => item._id === product._id);
  const outOfStock = itemInCart && itemInCart.qty >= itemInCart.countInStock;

  return (
    <div className="product">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>

      <Card.Body className="p-3">
        <Link to={`/product/${product.slug}`}>
          <Card.Title className="text-nowrap">{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>{product.price} $</Card.Text>
        {outOfStock && (
          <Button variant="secondary" disabled>
            Out of Stock
          </Button>
        ) }
      </Card.Body>
    </div>
  );
};

export default ProductCard;
