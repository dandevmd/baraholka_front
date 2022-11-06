import { Container } from "react-bootstrap";
import RegisterForm from "../components/authForms/RegisterForm";
import LoginForm from "../components/authForms/LoginForm";
import { useEffect, useState } from "react";

const AuthPage = () => {
  const [loc, setLoc] = useState("login");

  useEffect(() => {
    setLoc(window.location.pathname);
  }, [window.location.href]);

  return (
    <Container className="small_container">
      <h1 className="mb-3 d-flex justify-content-center align-items-center">
        {loc === "/login" ? "Login" : "Register"} to your account
      </h1>
      {loc === "/register" ? <RegisterForm /> : <LoginForm />}
    </Container>
  );
};

export default AuthPage;
