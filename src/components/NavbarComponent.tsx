import { useEffect, useState } from "react";
import { Navbar, Container, Nav, Badge, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useUserContext } from "../context/userContext";
import { useCheckoutContext } from "../context/checkoutContext";
import axios from "axios";

import SearchBoxComponent from "./SearchBoxComponent";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const { cart, dispatch: cartDispatch } = useCartContext();
  const { user, dispatch: userDispatch } = useUserContext();
  const [categories, setCategories] = useState<string[]>([]);
  const { stepOne, dispatch: checkoutDispatch } = useCheckoutContext();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const logoutHandler = () => {
    userDispatch({ type: "LOGOUT" });
    cartDispatch({ type: "CLEAR_CART_STATE" });
    checkoutDispatch({ type: "CLEAR_CHECKOUT_STATE" });
    localStorage.removeItem("cart");

    navigate("/login");
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [screenWidth, cart]);

  const handleResize = () => setScreenWidth(window.innerWidth);
  let cartBadge =
    screenWidth > 980 &&
    (cart && cart.length > 0 ? (
      <Badge pill bg="warning">
        {cart.length}
      </Badge>
    ) : (
      <Badge pill bg="primary">
        0
      </Badge>
    ));

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/products/categories`
      );
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/" className="text-warning h4 mt-1">
          BARAHOLKA
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="bg-warning"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto w-100 justify-content-end align-items-center">
            <>
              <SearchBoxComponent />
            </>

            <>
              <Nav.Link href="/cart" className="mx-3">
                Cart {cartBadge} <span className="mx-1" />
              </Nav.Link>
            </>

            {user ? (
              <>
                <NavDropdown id="basic-nav-dropdown" title="Categories">
                  {categories &&
                    categories.map((category: string) => (
                      <LinkContainer
                        to={`/products/${category}`}
                        key={category}
                      >
                        <NavDropdown.Item>{category}</NavDropdown.Item>
                      </LinkContainer>
                    ))}
                </NavDropdown>

                <NavDropdown id="basic-nav-dropdown" title={user && user.name}>
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orders">
                    <NavDropdown.Item>Order History</NavDropdown.Item>
                  </LinkContainer>
                  <>
                    <LinkContainer to="/login" onClick={logoutHandler}>
                      <NavDropdown.Item>Logout</NavDropdown.Item>
                    </LinkContainer>
                  </>
                </NavDropdown>


                {user && user.isAdmin && (
                  <NavDropdown id="basic-nav-dropdown" title="GOD_MODE">
                    <LinkContainer to="/dashBoard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/userList">
                      <NavDropdown.Item>Users List</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/productList">
                      <NavDropdown.Item>Products List</NavDropdown.Item>
                    </LinkContainer>{" "}
                    <LinkContainer to="/orderList">
                      <NavDropdown.Item>Orders List</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </>
            ) : (
              <Link to="/login" className="nav_link">
                Login
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
