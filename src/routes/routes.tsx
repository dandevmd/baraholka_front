import AdminDashBoardPage from "../pages/AdminDashBoardPage";
import AdminOrdersListPage from "../pages/AdminOrdersListPage";
import AdminProductListPage from "../pages/AdminProductListPage";
import AdminUsersListPage from "../pages/AdminUsersListPage";
import AuthPage from "../pages/AuthPage";
import CartPage from "../pages/CartPage";
import CategoryPage from "../pages/CategoryPage";
import CheckoutPage from "../pages/CheckoutPage";
import EditProductPage from "../pages/EditProductPage";
import FilterPage from "../pages/FilterPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import OrderPage from "../pages/OrderPage";
import ProductPage from "../pages/ProductPage";
import ProfilePage from "../pages/ProfilePage";
import UserInfoPage from "../pages/UserInfoPage";

export const privateRoutes = [
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/orders",
    element: <OrderHistoryPage />,
  },
  {
    path: "/orders/:id",
    element: <OrderPage />,
  },
];

export const publicRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/product/:slug",
    element: <ProductPage />,
  },
  {
    path: "/products/:category",
    element: <CategoryPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/register",
    element: <AuthPage />,
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/search",
    element: <FilterPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const adminRoutes = [
  {
    path: "/dashboard",
    element: <AdminDashBoardPage />,
  },
  {
    path: "/userList",
    element: <AdminUsersListPage />,
  },
  {
    path: "/userList/:id",
    element: <UserInfoPage />,
  },
  {
    path: "/productList",
    element: <AdminProductListPage />,
  },
  {
    path: "/productList/:id",
    element: <EditProductPage />,
  },
  {
    path: "/orderList",
    element: <AdminOrdersListPage />,
  },
];

