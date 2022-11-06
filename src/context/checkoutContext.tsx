import { createContext, useContext, useReducer } from "react";
import { toast } from "react-toastify";

type checkoutContextProviderType = {
  children: React.ReactNode;
};

type DispatchType = {
  type: string;
  payload?: any;
};

const getShippingStateFromLocalStorage = localStorage.getItem("shippingState");
const parsedShippingState =
  getShippingStateFromLocalStorage &&
  JSON.parse(getShippingStateFromLocalStorage);

const checkoutContextState = {
  stepOne: parsedShippingState || undefined,
  stepTwo: parsedShippingState?.paymentMethod || "",
  orders: [],
  isLoading: false,
  error: null,
  dispatch: (action: DispatchType) => {},
};

const checkoutContext = createContext(checkoutContextState);

const checkoutReducer = (
  state: any = checkoutContextState,
  action: DispatchType
) => {
  switch (action.type) {
    case "STEP_ONE_PASSED":
      return {
        ...state,
        stepOne: action.payload,
      };
    case "STEP_TWO_PASSED":
      return {
        ...state,
        stepTwo: action.payload,
      };
    case "CLEAR_CHECKOUT_STATE":
      return {
        ...state,
        stepOne: undefined,
        stepTwo: "",
      };
    

    default:
      return state;
  }
};

export const CheckoutContextProvider = ({
  children,
}: checkoutContextProviderType) => {
  const [state, dispatch] = useReducer(checkoutReducer, checkoutContextState);

  return (
    <checkoutContext.Provider value={{ ...state, dispatch }}>
      {children}
    </checkoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  const context = useContext(checkoutContext);
  if (!context) {
    toast.error("Error in checkoutContext");
  }
  return context;
};
