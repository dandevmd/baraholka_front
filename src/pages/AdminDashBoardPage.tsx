import axios from "axios";
import { useState, useEffect } from "react";
import Chart from "react-google-charts";
import { Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";

import { useUserContext } from "../context/userContext";
import Loader from "../components/Loader";

const AdminDashBoardPage = () => {
  const { user } = useUserContext();
  const [boardState, setBoardState] = useState({
    summary: {
      totalUsers: 0,
      totalOrders: 0,
      totalSales: 0,
      dailyOrders: [],
      productCategories: [],
    },
    isLoading: true,
  });

  useEffect(() => {
    user && user.isAdmin && fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/admin/stats`,
        {
          headers: {
            Authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin}`,
          },
        }
      );
      if (!data) return "No stats found";
      setBoardState({
        summary: {
          totalUsers: data.totalUsers,
          totalOrders: data.totalOrders,
          totalSales: data.totalSales,
          dailyOrders: data.dailyOrders,
          productCategories: data.productCategories,
        },
        isLoading: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
        setBoardState({ ...boardState, isLoading: false });
      }
      console.log(error);
    }
  };

  return (
    <>
      <h1>Admin Dashboard</h1>
      {boardState.isLoading ? (
        <Loader />
      ) : (
        <>
          <Row>
            <Col mc={4}>
              <Card>
                <Card.Body>
                  <Card.Title>{boardState.summary.totalUsers}</Card.Title>
                  <Card.Text>Total Users</Card.Text>
                </Card.Body>
              </Card>{" "}
            </Col>

            <Col mc={4}>
              <Card>
                <Card.Body>
                  <Card.Title>{boardState.summary.totalOrders}</Card.Title>
                  <Card.Text>Total Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col mc={4}>
              <Card>
                <Card.Body>
                  <Card.Title>$ {boardState.summary.totalSales} </Card.Title>
                  <Card.Text>Total Sales</Card.Text>
                </Card.Body>
              </Card>{" "}
            </Col>
          </Row>

          <div className="my-3">
            <h2>Sales Report</h2>
            {boardState.summary.dailyOrders.length === 0 ? (
              <Loader />
            ) : (
              <Chart
              width="100%"
              height="400px"
              chartType="AreaChart"
              loader={<div>Loading Chart...</div>}
              data={[
                ['Date', 'Sales'],
                ...boardState?.summary?.dailyOrders?.map((x:any) => [x._id, x.sales]),
              ]}
            ></Chart>
            )}
          </div>

          <div className="my-3">
            <h2>Categories</h2>
            {boardState.summary.productCategories.length === 0 ? (
              <Loader/>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...boardState.summary.productCategories.map((x:any) => [x?._id, x?.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AdminDashBoardPage;
