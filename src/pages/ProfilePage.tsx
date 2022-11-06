import { useEffect, useState } from "react";
import { Form, FormGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { useUserContext } from "../context/userContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, dispatch, isLoading, error } = useUserContext();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (form.email.length === 0 || form.name.length === 0) {
      toast.error("Name and email are required");
      return false;
    }

    return true;
  };

  const onSubmitHandler = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { name, email, password } = form;
    try {
      dispatch({ type: "UPDATE_USER_REQUEST" });
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/user/update`,
        { name, email, password: password },
        {
          headers: {
            Authorization: `Bearer ${user.token} ${user._id} ${user.isAdmin} `,
          },
        }
      );
      if (!data) {
        toast.error(error);
        console.log(error);
        return;
      }
      dispatch({ type: "UPDATE_USER_SUCCESS", payload: data });
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Profile updated successfully");
      setShow(false);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message, ">>>>>>>>", error);
        toast.error("Invalid email or password");
      }
    }
  };

  return (
    <div className="container container-smalls">
      <h1 className="text-center">User Profile</h1>

      <>
        <Form onSubmit={onSubmitHandler}>
          <FormGroup>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={form.name}
              id="name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormGroup>
          <FormGroup className="my-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              id="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={show ? "text" : "password"}
              value={form.password}
              id="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </FormGroup>
          <FormGroup className="my-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type={show ? "text" : "password"}
              value={form.confirmPassword}
              id="confirmPassword"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </FormGroup>
          
          <div className="d-flex flex-row justify-content-between">
            <div>
              <Button type="submit" className="btn btn-danger">
                Update
              </Button>
            </div>
            <div onClick={() => setShow(!show)} style={{ cursor: "pointer" }}>
              Show Password <i className="fas fa-eye" />
            </div>
          </div>
        </Form>
      </>
    </div>
  );
};

export default ProfilePage;
