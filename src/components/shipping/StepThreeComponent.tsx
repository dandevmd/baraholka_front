import { Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useCheckoutContext } from "../../context/checkoutContext";
import { useCartContext } from "../../context/CartContext";
import { CartItem } from "../../types";
import { toast } from "react-toastify";
import { useUserContext } from "../../context/userContext";

import Loader from "../Loader";
import { useOrdersContext } from "../../context/OrdersContext";

const StepThreeComponent = () => {
  const { stepTwo, dispatch, isLoading } = useCheckoutContext();
  const {dispatch:ordersDispatch} = useOrdersContext();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { cart, dispatch: cartDispatch } = useCartContext();

  const getShippingStateFromLocalStorage =
    localStorage.getItem("shippingState");
  const parsedShippingState =
    getShippingStateFromLocalStorage &&
    JSON.parse(getShippingStateFromLocalStorage);
  const { fullName, address, city, postalCode, country } = parsedShippingState
    ? parsedShippingState
    : "";

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.reduce((a: any, c: any) => a + c.qty * c.price, 0)
  );

  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const editAddress = () => {
    dispatch({ type: "CLEAR_CHECKOUT_STATE" });
  };
  const editPayment = () => {
    dispatch({ type: "STEP_TWO_PASSED", payload: "" });
  };

  const editCartItems = () => {
    return navigate("/cart");
  };
  const placeOrderHandler = async () => {
    ordersDispatch({ type: "CREATE_ORDER_START" });
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/orders`,
        {
          ...parsedShippingState,
          cart,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${user && user.token}`,
          },
        }
      );
      if (data) {
        ordersDispatch({ type: "CREATE_ORDER_SUCCESS" });
        cartDispatch({ type: "CLEAR_CART_STATE" });
        localStorage.removeItem("cart");
        dispatch({ type: "CLEAR_CHECKOUT_STATE" });
        localStorage.removeItem("shippingState");
        toast.success("Order placed successfully");
        navigate(`/orders/${data._id}`);
      }
      console.log(data);
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "CREATE_ORDER_FAIL", payload: error.message });
        toast.error(
          "Something went wrong placing your order. Please try again later."
        );
      }
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Row>
      <Col md={8}>
        <Card>
          <Card.Body>
            <Card.Title>Shipping</Card.Title>
            <Card.Text>
              <strong>Name: </strong>
              {fullName} <br />
              <strong>Address: </strong> {address} , {city}, {country},{" "}
              {postalCode}
            </Card.Text>
            <Button variant="warning" onClick={editAddress}>
              Edit Address
            </Button>
          </Card.Body>
        </Card>

        <Card className="my-3">
          <Card.Body>
            <Card.Title>Payment Method</Card.Title>
            <Card.Text>
              <strong>Method: </strong> {stepTwo}
            </Card.Text>
            <Button variant="warning" onClick={editPayment}>
              Edit Payment Method
            </Button>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Card.Title>Items</Card.Title>
            <ListGroup variant="flush">
              {cart.map((item: CartItem) => (
                <ListGroup.Item key={item._id}>
                  <Row className="d-flex align-items-center ">
                    <Col md={6}>
                      <img
                        src={item.image}
                        className="img-fluid rounded img-thumbnail"
                      />

                      <Link
                        to={`/product/${item.slug}`}
                        style={{ marginLeft: "8%" }}
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={3}>
                      <span>{item.qty} x</span>
                    </Col>
                    <Col md={3}>
                      <span>{item.price} $</span>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button variant="warning" onClick={editCartItems}>
              Edit Cart Items
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4}>
        <Card>
          <Card.Body>
            <Card.Title>Order Summary</Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong> Order Total</strong>
                  </Col>
                  <Col>
                    <strong>${cart.totalPrice.toFixed(2)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="d-grid">
                  <Button
                    type="button"
                    onClick={placeOrderHandler}
                    disabled={cart.length === 0}
                  >
                    Place Order
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StepThreeComponent;
