import { createContext, useContext, useReducer } from "react";

type userContextType = {
  children: React.ReactNode;
};

const getUserFromLocalStorage = localStorage.getItem("user");
const parsedUser =
  getUserFromLocalStorage && JSON.parse(getUserFromLocalStorage);

const defaultUserState = {
  user: parsedUser || null,
  error: false,
  isLoading: false,
  dispatch: (action: any) => {},
};

const UserContext = createContext(defaultUserState);

const userReducer = (state: any = defaultUserState, action: any) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, isLoading: true };
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload, isLoading: false };
    case "LOGIN_FAIL":
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    case "UPDATE_CREDENTIALS_REQUEST":
      return { ...state, isLoading: true };
    case "UPDATE_CREDENTIALS_SUCCESS":
      return { ...state, user: action.payload, isLoading: false };
    case "UPDATE_CREDENTIALS_FAIL":
      return { ...state, error: action.error, isLoading: false };
    case "LOGOUT":
      return { ...state, user: localStorage.removeItem("user") };

    default:
      return state;
  }
};

export const UserProvider = ({ children }: userContextType) => {
  const [state, dispatch] = useReducer(userReducer, defaultUserState);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
