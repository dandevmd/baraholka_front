import { Row, Col } from "react-bootstrap";
import { useCheckoutContext } from "../../context/checkoutContext";
import { useUserContext } from "../../context/userContext";

const CheckoutProgress = () => {
  const { stepOne, stepTwo } = useCheckoutContext();
  const { user } = useUserContext();

  return (
    <Row className="checkout_steps">
      <Col className={user && "active"}>Sign In</Col>
      <Col className={user && "active"}>Shipping</Col>
      <Col className={stepOne && "active"}>Payment</Col>
      <Col className={stepTwo && "active"}>Place Order</Col>
    </Row>
  );
};

export default CheckoutProgress;
