import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { Order } from "../types";
import Loader from "../components/Loader";
import axios from "axios";

const AdminOrdersListPage = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ordersState, setOrdersState] = useState({
    orders: [] as Order[],
    countOrders: 0,
    pages: 0,
  });
  const location = useLocation();
  const sp = new URLSearchParams(location.search);
  const page = sp.get("page") || 1;

  useEffect(() => {
    fetchOrders();
  }, [user, page, ordersState.countOrders, ordersState.pages, location.pathname]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/admin/ordersList?page=${page}`,
        {
          headers: {
            Authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin} `,
          },
        }
      );
      data &&
        setOrdersState({
          orders: data.orders,
          countOrders: data.countOrders,
          pages: data.pages,
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

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/admin/deleteOrder`,
        {
          headers: {
            Authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin}`,
          },
          data: { id },
        }
      );
      if (!data) {
        toast.error("Order not deleted");
      }
      setOrdersState({
        ...ordersState,
        orders: ordersState.orders.filter((order) => order._id !== id),
      });
      toast.success("Order deleted");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1>Orders</h1>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER_ID</th>
                <th>DATE</th>
                <th>PRICE</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {ordersState.orders &&
                ordersState.orders.map((order: Order) => (
                  <tr key={order?._id}>
                    <td>{order?._id}</td>
                    <td>{order?.user}</td>
                    <td>{order?.createdAt.substring(0, 10)}</td>
                    <td>{order?.totalPrice.toFixed(2)} $</td>
                    <td>
                      {order?.isPaid
                        ? order?.paidAt?.substring(0, 10)
                        : "FALSE"}
                    </td>
                    <td>
                      {order?.isDelivered
                        ? order?.deliveredAt?.substring(0, 10)
                        : "FALSE"}
                    </td>
                    <td>
                      <div className="d.flex justify-content-between align-items-center">
                        <Link
                          className="btn btn-light "
                          to={`/orders/${order?._id}`}
                        >
                          Show Details
                        </Link>

                        <button
                          className="btn btn-danger"
                          onClick={()=>handleDelete(order?._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <>
            {
              // @ts-ignore
              [...Array(ordersState.pages).keys()].map((x) => (
                <Link
                  className={
                    x + 1 === Number(page)
                      ? "btn btn-secondary text-bold"
                      : "btn"
                  }
                  key={x + 1}
                  to={`/orderList?page=${x + 1}`}
                >
                  {x + 1}
                </Link>
              ))
            }
          </>
        </>
      )}
    </>
  );
};

export default AdminOrdersListPage;
