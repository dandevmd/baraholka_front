import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Card, Badge, Button } from "react-bootstrap";
import RatingComp from "../components/RatingComp";
import Loader from "../components/Loader";
import { CartItem } from "../types";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "../context/userContext";
import { useCartContext } from "../context/CartContext";
import { Form, FloatingLabel } from "react-bootstrap";

const Product = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { cart, dispatch: cartDispatch } = useCartContext();
  const [selectedImage, setSelectedImage] = useState("");
  const [rating, setRating] = useState({
    rating: 0,
    numReviews: 0,
    reviews: [],
    comment: "",
  });
  const [product, setProduct] = useState({
    _id: "",
    name: "",
    slug: "",
    price: 0,
    image: "",
    images: [] as string[],
    category: "",
    description: "",
    countInStock: 0,
    brand: "",
    rating: 0,
    numReviews: 0,
    reviews: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    slug && fetchProduct(slug);
    document.title = slug ? slug : "Product";
  }, [slug, product.numReviews]);

  const fetchProduct = async (slug: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/products/slug/${slug}`
      );
      if (!data) {
        return toast.error("Product not found");
      }
      setProduct({
        _id: data._id,
        name: data.name,
        slug: data.slug,
        price: data.price,
        image: data.image,
        images: data.images,
        category: data.category,
        description: data.description,
        countInStock: data.countInStock,
        brand: data.brand,
        rating: data.rating,
        reviews: data?.reviews,
        numReviews: data?.numReviews,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
      console.log(error);
    }
    setLoading(false);
  };

  const addToCartHandler = async () => {
    const existingItem = cart.find(
      (item: CartItem) => item._id === product?._id
    );
    const quantity = existingItem ? existingItem.qty + 1 : 1;
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/products/slug/${slug}`
    );
    if (data.countInStock < quantity) {
      toast.error("Sorry, product is out of stock");
      return;
    }
    if (!existingItem) {
      cartDispatch({
        type: "ADD_TO_CART",
        payload: { ...product, qty: 1 } as CartItem,
      });
    }
    localStorage.setItem(
      "cart",
      JSON.stringify([...cart, { ...product, qty: 1 }])
    );

    navigate("/cart");
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rating.rating || !rating.comment) {
      return toast.error("Please select rating and comment");
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/products/${product._id}/reviews`,
        {
          rating: rating.rating,
          comment: rating.comment,
          name: user?.name,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (!data) {
        return toast.error("Something went wrong while submitting review");
      }
      setProduct({ ...product, numReviews: product.numReviews + 1 });
      setRating({ rating: 0, comment: "", numReviews: 0, reviews: [] });
      toast.success("Review submitted successfully");
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

  return !product ? (
    <div className="w-100 h-auto danger">Product is probably undefined</div>
  ) : (
    <>
      <Row>
        <Col md={6}>
          <img
            src={selectedImage || product.image}
            className="image_large"
            alt={product.name}
          />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>{product.name}</h1>

              <RatingComp rating={product.rating} />
            </ListGroup.Item>
            <ListGroup.Item>Description : {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price : </Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row xs={1} md={2} className="g-2">
                    {[product.image, ...product.images].map((i) => (
                      <Col key={i}>
                        <Card>
                          <Button
                            type="button"
                            variant="light"
                            className="thumbnail"
                            onClick={() => setSelectedImage(i)}
                          >
                            <Card.Img variant="top" alt="product" src={i} />
                          </Button>
                        </Card>{" "}
                      </Col>
                    ))}
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status : </Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In stock</Badge>
                      ) : (
                        <Badge bg="success">Out of stock</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <div className="d-grid">
                      <Button variant="warning" onClick={addToCartHandler}>
                        ADD TO CART
                      </Button>{" "}
                    </div>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className="my-3">
        {product.reviews.length !== 0 && <h2>Reviews</h2>}
        <div className="mb-3">
          <ListGroup variant="flush">
            {product.reviews.length !== 0 &&
              product.reviews.map(
                (review: {
                  _id: string;
                  name: string;
                  rating: number;
                  comment: string;
                }) => (
                  <ListGroup.Item key={review?._id}>
                    <strong>{review?.name}</strong>
                    <RatingComp rating={review?.rating} />
                    <p>{review?.comment}</p>
                  </ListGroup.Item>
                )
              )}
          </ListGroup>
          <div className="my-3">
            {user && (
              <form onSubmit={submitHandler}>
                <h2>Write a customer review</h2>
                <Form.Group className="mb-3" controlId="rating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    aria-label="Rating"
                    value={rating.rating}
                    onChange={(e) =>
                      setRating({ ...rating, rating: Number(e.target.value) })
                    }
                  >
                    <option value="">Select...</option>
                    <option value="1">1- Poor</option>
                    <option value="2">2- Fair</option>
                    <option value="3">3- Good</option>
                    <option value="4">4- Very good</option>
                    <option value="5">5- Excelent</option>
                  </Form.Select>
                </Form.Group>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Comments"
                  className="mb-3"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    value={rating.comment}
                    onChange={(e) =>
                      setRating({ ...rating, comment: e.target.value })
                    }
                  />
                </FloatingLabel>

                <div className="mb-3">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
