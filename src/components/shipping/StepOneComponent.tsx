import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useCheckoutContext } from "../../context/checkoutContext";

const StepOneComponent = () => {
  const { dispatch } = useCheckoutContext();
  
  const getShippingStateFromLocalStorage =
    localStorage.getItem("shippingState");
  const parsedShippingState =
    getShippingStateFromLocalStorage &&
    JSON.parse(getShippingStateFromLocalStorage);
  const { fullName, address, city, postalCode, country } =
     parsedShippingState ? parsedShippingState : ''

  const [step1, setStep1] = useState({
    fullName: fullName || "",
    city: city || "",
    address: address || "",
    country: country || "",
    postalCode: postalCode || "",
  });
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "STEP_ONE_PASSED", payload: step1 });
    localStorage.setItem("shippingState", JSON.stringify(step1));
  };

  return (
    <>
      <Form onSubmit={onSubmitHandler}>
        <Form.Group controlId="fullName" className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter full name"
            value={step1.fullName}
            required
            onChange={(e) => setStep1({ ...step1, fullName: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="fullName" className="mb-3">
          <Form.Label>Adress</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter full name"
            value={step1.address}
            required
            onChange={(e) => setStep1({ ...step1, address: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="city" className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={step1.city}
            required
            onChange={(e) => setStep1({ ...step1, city: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="country" className="mb-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={step1.country}
            required
            onChange={(e) => setStep1({ ...step1, country: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="postalCode" className="mb-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postal code"
            value={step1.postalCode}
            required
            onChange={(e) => setStep1({ ...step1, postalCode: e.target.value })}
          />
        </Form.Group>
        <div>
          <Button type="submit" variant="warning">
            Continue
          </Button>
        </div>
      </Form>
    </>
  );
};

export default StepOneComponent;
