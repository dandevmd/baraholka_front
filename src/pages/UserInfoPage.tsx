import { useState, useEffect } from "react";
import { useUserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { User } from "../types";
import axios from "axios";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { FormGroup } from "react-bootstrap";

const UserInfoPage = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    isAdmin: false,
    
  });

  useEffect(() => {
    fetchUserInfo();
  }, [userId]);

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/admin/user/${userId}`,
        {
          headers: {
            Authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin}`,
          },
        }
      );
      data &&
        setUserInfo({
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin,
          
          
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

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/admin/editUser/${userId}`,
        userInfo,
        {
          headers: {
            Authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin} `,
          },
        }
      );
      data && toast.success("User updated successfully");
      navigate("/userList");
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
        <Container className="small-container">
          <h1>User Info</h1>

          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={userInfo.email}
                type="email"
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Check
              className="mb-3"
              type="checkbox"
              id="isAdmin"
              label="isAdmin"
              checked={userInfo.isAdmin}
              onChange={(e) =>
                setUserInfo({ ...userInfo, isAdmin: e.target.checked })
              }
            />
           
            
            <div className="mb-3">
              <Button type="submit">Update</Button>
            </div>
          </Form>
        </Container>
      )}
    </>
  );
};

export default UserInfoPage;
