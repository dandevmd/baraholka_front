import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import RatingComp from "../components/RatingComp";
import Loader from "../components/Loader";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import { LinkContainer } from "react-router-bootstrap";

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];

const FilterPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    products: [] as Product[],
    page: 1,
    pages: [] as number[],
    countProducts: 0,
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchParamQuery = {
    category: searchParams.get("category") || "all",
    query: searchParams.get("query") || "all",
    price: searchParams.get("price") || "all",
    rating: searchParams.get("rating") || "all",
    order: searchParams.get("order") || "newest",
    page: searchParams.get("page") || 1,
  };

  useEffect(() => {
    document.title = "Filter Page";
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProductsByQuery();
  }, [
    searchParamQuery.category,
    searchParamQuery.query,
    searchParamQuery.price,
    searchParamQuery.rating,
    searchParamQuery.order,
    searchParamQuery.page,
  ]);

  const getFilterUrl = (filter: any) => {
    const filterPage = filter?.page || searchParamQuery?.page;
    const filterCategory = filter?.category || searchParamQuery?.category;
    const filterQuery = filter?.query || searchParamQuery?.query;
    const filterPrice = filter?.price || searchParamQuery?.price;
    const filterRating = filter?.rating || searchParamQuery?.rating;
    const filterOrder = filter?.order || searchParamQuery?.order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&page=${filterPage}`;
  };

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

  const fetchProductsByQuery = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/products/search?page=${searchParamQuery.page}&query=${searchParamQuery.query}&category=${searchParamQuery.category}&price=${searchParamQuery.price}&rating=${searchParamQuery.rating}&order=${searchParamQuery.order}`
      );

      setIsLoading(false);
      data &&
        setState({
          products: data.products,
          page: data.page,
          pages: data.pages,
          countProducts: data.countProducts,
        });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.log(error.message);
      }
      console.log(error);
      setIsLoading(false);
    }
  };


  return (
    <>
      <Row>
        <Col md={3}>
          <h3 className="mb-5">Department</h3>
          <div>
            <h4>Category</h4>
            <ul>
              <Link
                to={getFilterUrl({ category: "all" })}
                className={
                  "all" === searchParamQuery.category
                    ? "filter_link_active"
                    : "filter_link"
                }
              >
                Any
              </Link>
              {categories &&
                categories.length > 0 &&
                categories.map((c) => (
                  <li key={c}>
                    <Link
                      to={getFilterUrl({ category: c })}
                      className={
                        c === searchParamQuery.category
                          ? "filter_link_active"
                          : "filter_link"
                      }
                    >
                      {c}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h4>Price</h4>
            <ul>
            <Link
                to={getFilterUrl({ price: "all" })}
                className={
                  "all" === searchParamQuery.price
                    ? "filter_link_active"
                    : "filter_link"
                }
              >
                Any
              </Link>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={
                      p.value === searchParamQuery.price
                        ? "filter_link_active"
                        : "filter_link"
                    }
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Rating</h4>
            <ul>
              <li>
              <Link
                to={getFilterUrl({ rating: "all" })}
                className={
                  "all" === searchParamQuery.rating
                    ? "filter_link_active"
                    : "filter_link"
                }
              >
                Any
              </Link>
              </li>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={
                      `${r.rating}` === `${searchParamQuery.rating}`
                        ? "filter_link_active filter_link_align"
                        : "filter_link filter_link_align"
                    }
                  >
                    <span>Up to</span>

                    <RatingComp rating={r.rating} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {state.countProducts === 0 ? "No" : state.countProducts}{" "}
                    Results
                    {searchParamQuery?.query !== "all" &&
                      " : " + searchParamQuery?.query}
                    {searchParamQuery?.category !== "all" &&
                      " : " + searchParamQuery?.category}
                    {searchParamQuery?.price !== "all" &&
                      " : Price " + searchParamQuery?.price}
                    {searchParamQuery?.rating !== "all" &&
                      " : Rating " + searchParamQuery?.rating + " & up"}
                    {searchParamQuery?.query !== "all" ||
                    searchParamQuery?.category !== "all" ||
                    searchParamQuery?.rating !== "all" ||
                    searchParamQuery?.price !== "all" ? (
                      <Button
                        variant="light"
                        onClick={() => navigate("/search")}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>

                <Col className="text-end">
                  Sort by{" "}
                  <select
                    value={searchParamQuery.order}
                    onChange={(e) =>
                      navigate(getFilterUrl({ order: e.target.value }))
                    }
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>

              {state.products.length === 0 && (
                <div className="text-center danger">No Products Found</div>
              )}

              <Row>
                {state.products.length > 0 &&
                  state.products.map((product) => (
                    <Col sm={6} lg={4} key={product?._id} className="mb-3">
                      <ProductCard product={product} />
                    </Col>
                  ))}
              </Row>

              <div>
                {/* @ts-ignore */}
                {[...Array(state.pages).keys()].map((p) => (
                  <LinkContainer
                    key={p + 1}
                    to={getFilterUrl({ page: p + 1 })}
                    className="mx-1"
                  >
                    <Button
                      variant="light"
                      className={
                        Number(state.page) === p + 1 ? "bg-warning text-weight-bold" : ""
                      }
                    >
                      {p + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default FilterPage;
