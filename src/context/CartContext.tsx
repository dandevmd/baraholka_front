import { createContext, useContext, useReducer } from "react";
import { toast } from "react-toastify";
import { CartItem } from "../types";

type CartContextProviderType = {
  children: React.ReactNode;
};

export type DispatchType = {
  type: string;
  payload?: CartItem;
};

const getCartFromLocalStorage = localStorage.getItem("cart");
const parsedCart =
  getCartFromLocalStorage && JSON.parse(getCartFromLocalStorage);

const CartContextState = {
  cart: parsedCart || ([] as CartItem[]),
  dispatch: (action: DispatchType) => {},
};

const CartContext = createContext(CartContextState);

const cartReducer = (state = CartContextState, action: DispatchType) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case "INCREASE_QTY":
      return {
        ...state,
        cart: state.cart.map((item: CartItem) => {
          if (action.payload && item._id === action.payload._id) {
            const newQty =
              action.payload.countInStock > item.qty
                ? { ...item, qty: item.qty + 1 }
                : item;
            const newCart = state.cart.map((item: CartItem) =>
              action.payload && item._id === action.payload._id ? newQty : item
            );
            localStorage.setItem("cart", JSON.stringify(newCart));

            return newQty;
          }

          return item;
        }),
      };

    case "DECREASE_QTY":
      return {
        ...state,
        cart: state.cart.map((item: CartItem) => {
          if (action.payload && item._id === action.payload._id) {
            const newQty = item.qty > 1 ? { ...item, qty: item.qty - 1 } : item;
            const newCart = state.cart.map((item: CartItem) => {
              if (action.payload && item._id === action.payload._id) {
                return newQty;
              }
              return item;
            });
            localStorage.setItem("cart", JSON.stringify(newCart));
            return newQty;
          }

          return item;
        }),
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item: CartItem) => {
          const newCart = action.payload && item._id !== action.payload._id;
          localStorage.setItem("cart", JSON.stringify(newCart));
          return newCart;
        }),
      };
    case "CLEAR_CART_STATE":
      return {
        ...state,
        cart: [],
      };
    default:
      return state;
  }
};

export const CartContextProvider = ({ children }: CartContextProviderType) => {
  const [state, dispatch] = useReducer(cartReducer, CartContextState);

// 
  return (
    <CartContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    toast.error("useCartContext must be used within CartContextProvider");
  }
  return context;
};
