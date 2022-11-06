import React, { useEffect, useState } from "react";
import { Card, Row, Col, ListGroup, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

import { useUserContext } from "../context/userContext";

import Loader from "../components/Loader";
import { Order } from "../types";
import { toast } from "react-toastify";

const OrderPage = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const [order, setOrder] = useState<Order>();
  const [state, payPalDispatch] = usePayPalScriptReducer();
  const [paymentData, setPaymentData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [paymentData]);

  useEffect(() => {
    document.title = `Order ${order && order._id}`;
    order && loadPayPalScript();
  }, [order, payPalDispatch]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user?._id}`,
          },
        }
      );
      setOrder(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  const loadPayPalScript = async () => {
    setIsLoading(true);
    try {
      const { data: payPalId } = await axios.get(
        `${process.env.REACT_APP_API}/paypal`,
        {
          headers: {
            Authorization: `Bearer ${user?._id}`,
          },
        }
      );
      if (!payPalId) {
        console.log("PayPal ID not found");
      }

      payPalDispatch({
        type: "resetOptions",
        value: {
          "client-id": payPalId.toString(),
          currency: "USD",
          intent: "capture",
        },
      });
      payPalDispatch({
        type: "setLoadingStatus",
        value: "pending" as any,
      });

      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error("Error loading PayPal script");
      }
      console.log(error);
    }
  };

  const createOrder = async (data: any, actions: any) => {
    try {
      const createdOrder = await actions.order.create({
        purchase_units: [
          {
            amount: {
              value: order?.totalPrice,
            },
          },
        ],
      });
      return createdOrder;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error("Error creating order");
      }
    }
  };

  function onApprove(data: any, actions: any) {
    return actions.order.capture().then(async function (details: any) {
      try {
        setIsLoading(true);
        const { data } = await axios.put(
          `${process.env.REACT_APP_API}/orders/${order?._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${user._id}` },
          }
        );
        setIsLoading(false);
        setPaymentData(data);
        toast.success("Order is paid");
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    });
  }

  const handleDelivery = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/admin/deliver/${order?._id}`,
        {},
        {
          headers: {
            authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin}`,
          },
        }
      );

      if (!data) {
        toast.error("Error delivering order");
      }

      setOrder(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error("Error delivering order");
      }
      console.log(error);
    }
    setIsLoading(false);
  };

  const onError = (error: any) => {
    console.log(error);
    toast.error(error.message);
  };

  console.log(order)
  return (
    <>
      {!order && <Loader />}
      {user && order && (
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {order.shippingAddress.address},
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </Card.Text>
                {order.isDelivered ? (
                  <Button variant="success" disabled>
                    Delivered at {order.isPaid}
                  </Button>
                ) : (
                  <Button variant="danger" disabled>
                    Not Delivered
                  </Button>
                )}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Method:</strong> {order.paymentMethod}
                </Card.Text>
                {order.isPaid ? (
                  <Button variant="success" disabled>
                    Paid at {order.paidAt}
                  </Button>
                ) : (
                  <Button variant="danger" disabled>
                    Not Paid
                  </Button>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Items</Card.Title>
                <ListGroup variant="flush">
                  {order.orderItems.map((item: any) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          ></img>{" "}
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={3}>${item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${order.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong> Order Total</strong>
                      </Col>
                      <Col>
                        <strong>${order.totalPrice.toFixed(2)}</strong>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-center align-items-center my-3">
                      {isLoading ? (
                        <div
                          className="spinner-border text-dark d-flex justify-content-center align-items-center"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        !order.paidAt && (
                          <div className="d-flex justify-content-center align-items-center">
                            <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {user &&
                      user.isAdmin &&
                      order.isPaid &&
                      !order.isDelivered && (
                        <div className="d-flex justify-content-center align-items-center ">
                          <Button
                            variant="btn btn-warning "
                            onClick={handleDelivery}
                          >
                            Deliver Order
                          </Button>
                        </div>
                      )}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default OrderPage;
