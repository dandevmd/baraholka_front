import { Row, Col, ListGroup, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";


import { useCartContext } from "../context/CartContext";
import { CartItem } from "../types";
import { useUserContext } from "../context/userContext";

const CartPage = () => {
  const { cart, dispatch } = useCartContext();
  const { user } = useUserContext();
  const navigate = useNavigate();

 

  return (
    <>
      <h1>SHOPPING CART</h1>
      {cart && cart.length > 0 ? (
        <Row className="d-flex flex-sm-column flex-lg-row flex-nowrap justify-content-between ">
          <>
            <>
              <ListGroup className="w-75 mb-5">
                {cart &&
                  cart.map((item: CartItem) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col
                          md={4}
                          className="d-flex justify-content-around align-items-center"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail "
                          />{" "}
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>
                          <Button
                            variant="light"
                            disabled={item.qty === 1}
                            onClick={() =>
                              dispatch({
                                type: "DECREASE_QTY",
                                payload: item,
                              })
                            }
                          >
                            <i className="fas fa-minus-circle" />
                          </Button>{" "}
                          <span>{item.qty}</span>{" "}
                          <Button
                            variant="light"
                            disabled={item.qty === item.countInStock}
                            onClick={() => {
                              dispatch({
                                type: "INCREASE_QTY",
                                payload: item,
                              });
                            }}
                          >
                            <i className="fas fa-plus-circle" />
                          </Button>
                        </Col>
                        <Col md={3}>$ {item.price}</Col>
                        <Col md={2}>
                          <Button
                            variant="light"
                            onClick={() =>
                              dispatch({
                                type: "REMOVE_FROM_CART",
                                payload: item,
                              })
                            }
                          >
                            <i className="fas fa-trash" />
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h3>
                        TOTAL : ${" "}
                        {cart &&
                          cart.reduce(
                            (a: any, c: any) => a + c.price * c.qty,
                            0
                          )}
                      </h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button
                          type="button"
                          variant="warning"
                          disabled={cart && cart.length === 0}
                          onClick={() =>
                            !user ? navigate("/login") : navigate("/checkout")
                          }
                        >
                          Proceed to Checkout
                        </Button>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </>
        </Row>
      ) : (
        <div className="warning w-100">
          Cart is empty.{" "}
          <Link to="/">
            <u>Go Shopping</u>
          </Link>
        </div>
      )}
    </>
  );
};

export default CartPage;
