import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalOptions = {
  "client-id": "sb",
  currency: "USD",
  intent: "capture",
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PayPalScriptProvider deferLoading={true} options={PayPalOptions}>
        <App />
      </PayPalScriptProvider>
    </BrowserRouter>
  </React.StrictMode>
);
