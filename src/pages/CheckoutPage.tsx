import { useEffect, useState } from "react";
import StepOneComponent from "../components/shipping/StepOneComponent";
import { useCheckoutContext } from "../context/checkoutContext";
import CheckoutProgress from "../components/shipping/CheckoutProgress";
import StepTwoComponent from "../components/shipping/StepTwoComponent";
import StepThreeComponent from "../components/shipping/StepThreeComponent";

const CheckoutPage = () => {
  const { stepOne, stepTwo } = useCheckoutContext();

  useEffect(() => {
    if (stepTwo) {
      document.title = "Preview Order";
      return;
    }
    if (!stepOne) {
      document.title = "Shipping";
      return;
    }
    if (stepOne) {
      document.title = "Payment";
      return;
    }
  }, [stepOne, stepTwo]);


  return (
    <>
      <CheckoutProgress />
      <h1 className="d-flex justify-content-center align-items-center my-4">
        {!stepOne && "Shipping Address"}
        {stepOne && stepOne.step1 && "Payment"}
        {stepOne && stepOne.step2 && "Preview Order"}
      </h1>
      <div className=" container small-container">
        {!stepOne && <StepOneComponent />}
        {stepOne && !stepTwo && <StepTwoComponent />}
        {stepOne && stepTwo && <StepThreeComponent />}
      </div>
    </>
  );
};

export default CheckoutPage;
