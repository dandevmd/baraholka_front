import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });

  const validateForm = () => {
    if (form.email.length > 0 && form.password1.length > 0) {
      if (form.password1 !== form.password2) {
        return toast.error("Passwords do not match");
      }
      return;
    } else {
      return toast.error("Please fill all fields");
    }
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateForm();
    try {
      const { name, email, password1: password } = form;
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/user/register`,
        { name, email, password }
      );
      if (data) {
        toast.success("Registration successful");
        navigate("/login");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message, ">>>>>>>>", error);
        toast.error("Invalid email or password");
      }
    }
  };

  return (
    <Form className="my-3" onSubmit={onSubmitHandler}>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          id="name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </Form.Group>{" "}
      <Form.Group className="mt-3">
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
          id="password"
          onChange={(e) => setForm({ ...form, password1: e.target.value })}
          required
        />
      </Form.Group>{" "}
      <Form.Group className="my-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          id="password2"
          onChange={(e) => setForm({ ...form, password2: e.target.value })}
          required
        />
      </Form.Group>
      <Button type="submit" className=" btn btn-warning">
        Submit
      </Button>
      <div className="my-3 d-flex justify-content-center align-items-center">
        Have an account already ?{" "}
        <Link to="/login">&nbsp;
          {" "}
          <u> Go to Login ! </u>{" "}
        </Link>
      </div>
    </Form>
  );
}

export default RegisterForm;
