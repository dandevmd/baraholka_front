import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRouter from "./routes";
import NavbarComponent from "./components/NavbarComponent";

import { CartContextProvider } from "./context/CartContext";
import { UserProvider } from "./context/userContext";
import { CheckoutContextProvider } from "./context/checkoutContext";
import { OrdersContextProvider } from "./context/OrdersContext";

const App = () => {
  return (
    <>
      <UserProvider>
        <CartContextProvider>
          <NavbarComponent />
          <Container className="mt-3">
            <main>
              <CheckoutContextProvider>
                <OrdersContextProvider>
                  <AppRouter />
                </OrdersContextProvider>
              </CheckoutContextProvider>
            </main>
          </Container>
        </CartContextProvider>
      </UserProvider>
      <ToastContainer />
    </>
  );
};

export default App;
