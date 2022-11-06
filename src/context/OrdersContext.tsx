import axios from "axios";
import { createContext, useContext, useReducer } from "react";
import { toast } from "react-toastify";
import { Order } from "../types";

type checkoutContextProviderType = {
  children: React.ReactNode;
};
type DispatchType = {
  type: string;
  payload?: Order[] | undefined | string;
};

const ordersContextState = {
  orders: [] as Order[],
  isLoading: false,
  error: null,
  dispatch: (action: DispatchType) => {},
};

const ordersContext = createContext(ordersContextState);

const ordersReducer = (
  state: any = ordersContextState,
  action: DispatchType
) => {
  switch (action.type) {
    case "CREATE_ORDER_START":
      return {
        ...state,
        isLoading: true,
      };
    case "CREATE_ORDER_SUCCESS":
      return {
        ...state,
        isLoading: false,
        orders: [...state.orders, action.payload],
      };
    case "CREATE_ORDER_FAIL":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "GET_ORDERS_START":
      return {
        ...state,
        isLoading: true,
      };
    case "GET_ORDERS_SUCCESS":
      return {
        ...state,
        isLoading: false,
        orders: action.payload,
      };
    case "GET_ORDERS_FAIL":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const OrdersContextProvider = ({
  children,
}: checkoutContextProviderType) => {
  const [state, dispatch] = useReducer(ordersReducer, ordersContextState);

  const value = { ...state, dispatch };
  return (
    <ordersContext.Provider value={value}>{children}</ordersContext.Provider>
  );
};

export const useOrdersContext = () => {
  const context = useContext(ordersContext);
  if (!context) {
    toast.error("Error in ordersContext");
  }
  return context;
};
