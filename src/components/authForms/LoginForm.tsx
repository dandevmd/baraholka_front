import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { useUserContext } from "../../context/userContext";
import { toast } from "react-toastify";

function LoginForm() {
  const navigate = useNavigate();
  const { user, dispatch } = useUserContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    return form.email.length > 0 && form.password.length > 0;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_REQUEST" });
    validateForm();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/user/login`,
        form
      );
      if (data) {
        dispatch({ type: "LOGIN_SUCCESS", payload: data });
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
        toast.success("Login successful");
        return;
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAIL", error: error });
      if (error instanceof Error) {
        console.log(error.message, ">>>>>>>>", error);
        toast.error("Invalid email or password");
      }
    }
  };

  return (
    <Form className="my-2" onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          id="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </Form.Group>{" "}
      <Form.Group className="my-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          id="password1"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </Form.Group>{" "}
      <Button type="submit" className=" btn btn-warning">
        Submit
      </Button>
      <div className="my-3 d-flex justify-content-center align-items-center">
        You don't have an account ?&nbsp;
        <Link to="/register">
          <u> Go to Registration page ! </u>
        </Link>
      </div>
    </Form>
  );
}

export default LoginForm;
