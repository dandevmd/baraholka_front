import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";

import { useOrdersContext } from "../context/OrdersContext";
import { useUserContext } from "../context/userContext";

import { Order } from "../types";

import Loader from "../components/Loader";

const OrderHistoryPage = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { orders, error, isLoading, dispatch } = useOrdersContext();

  useEffect(() => {
    fetchOrders();
  }, [user]);

 

  const fetchOrders = async () => {
    dispatch({ type: "GET_ORDERS_START" });
    try {
      const { data: allOrders } = await axios.get(
        `${process.env.REACT_APP_API}/orders`,
        {
          headers: {
            Authorization: `Bearer ${user?.token} ${user?._id}`,
          },
        }
      );
      if (!allOrders) {
        throw new Error("No orders found");
      }
      dispatch({ type: "GET_ORDERS_SUCCESS", payload: allOrders });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: "GET_ORDERS_FAIL", payload: error.message });
      }
      console.log(error);
    }
  };

  if (error) {
    return <div className="danger">{error}</div>;
  }

  return (
    <>
      <h1 className="d-flex justify-content-center align-items-center">
        Order History
      </h1>
      {isLoading ? (
        <Loader />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order: Order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>{order ? order?.paidAt?.substring(0, 10) : "No"}</td>
                  <td>{order ? order?.deliveredAt?.substring(0, 10) : "No"}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/orders/${order._id}`);
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default OrderHistoryPage;
