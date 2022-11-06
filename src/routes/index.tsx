import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  privateRoutes,
  publicRoutes,
  adminRoutes,
} from "./routes";
import { useUserContext } from "../context/userContext";

const AppRouter = () => {
  const { user } = useUserContext();
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle = () => {
      switch (pathname) {
        case "/dashBoard":
          return (document.title = "Admin Dashboard");
        case "/userList":
          return (document.title = "User List");
        case "/productList":
          return (document.title = "Product List");
        
        case "/orderList":
          return (document.title = "Order List");
      
        case "/cart":
          return (document.title = "Cart");
        case "/products/Pants":
          return (document.title = "Pants");
        case "/products/Shirts":
          return (document.title = "Shirts");
        case "/":
          return (document.title = "Home");
        case "/orders":
          return (document.title = "Orders");
        case "/profile":
          return (document.title = "Profile");

        default:
          return;
      }
    };
    pageTitle();
  }, [pathname]);

  return (
    <Routes>
      {publicRoutes.map((route: { path: string; element: JSX.Element }) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {user &&
        privateRoutes.map((route: { path: string; element: JSX.Element }) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      {user &&
        user.isAdmin &&
        adminRoutes.map((route: { path: string; element: JSX.Element }) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      
    </Routes>
  );
};

export default AppRouter;
