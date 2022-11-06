import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

import { useCheckoutContext } from "../../context/checkoutContext";

const StepTwoComponent = () => {
  const { stepTwo, stepOne, dispatch: dispatchCheckout } = useCheckoutContext();
  const [paymentMethod, setPaymentMethod] = useState(stepTwo || "PayPal");

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatchCheckout({ type: "STEP_TWO_PASSED", payload: paymentMethod });
    Object.assign(stepOne, { paymentMethod });
    localStorage.setItem("shippingState", JSON.stringify(stepOne));
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center ">
      <Form onSubmit={onSubmitHandler} className="mt-5">
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="PayPal"
            label="PayPal"
            name="PayPal"
            value="PayPal"
            checked={paymentMethod === "PayPal"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>{" "}
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="Stripe"
            label="Stripe"
            name="Stripe"
            value="Stripe"
            checked={paymentMethod === "Stripe"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Button variant="warning" type="submit">
            Choose
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default StepTwoComponent;
