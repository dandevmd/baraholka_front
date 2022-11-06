import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useUserContext } from "../context/userContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Product } from "../types";

const AdminProductListPage = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [productsState, setProductsState] = useState({
    products: [] as Product[],
    countProducts: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const sp = new URLSearchParams(location.search);
  const page = sp.get("page") || 1;

  useEffect(() => {
    fetchProducts();
  }, [user, page, productsState.countProducts, productsState.pages , location.pathname]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/admin/productsList?page=${page}`,
        {
          headers: {
            Authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin} `,
          },
        }
      );
      data &&
        setProductsState({
          products: data.products,
          countProducts: data.countProducts,
          pages: data.pages,
        });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
      console.log(error);
    }
    setLoading(false);
  };

  const createProductHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/admin/createProduct`,
        {},
        {
          headers: {
            Authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin} `,
          },
        }
      );
      if (!data) {
        return toast.error("Product not created");
      }
      setProductsState({
        ...productsState,
        products: [...productsState.products, data],
      });
      toast.success("Product created");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
      console.log(error);
    }
    setLoading(false);
  };

  const deleteProductHandler = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/admin/deleteProduct`,

        {
          headers: {
            Authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin} `,
          },
          data: { id },
        }
      );
      if (!data) {
        return toast.error("Product not deleted");
      }
      setProductsState({
        ...productsState,
        products: productsState.products.filter((p) => p._id !== id),
      });
      toast.success("Product deleted");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
      console.log(error);
    }
    setLoading(false);
  };

  console.log(productsState.pages);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h1>Admin Product List</h1>
            <button className="btn btn-warning" onClick={createProductHandler}>
              Create New Product{" "}
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {productsState.products &&
                productsState.products.map((product: Product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <div className="d.flex justify-content-between align-items-center">
                        <button
                          className="btn btn-danger "
                          onClick={() => deleteProductHandler(product._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-light mx-2"
                          onClick={() =>
                            navigate("/productList/" + product._id)
                          }
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <>
            {
              // @ts-ignore
              [...Array(productsState.pages).keys()].map((x) => (
                <Link
                  className={
                    x + 1 === Number(page) ? "btn btn-secondary text-bold" : "btn"
                  }
                  key={x + 1}
                  to={`/productList?page=${x + 1}`}
                >
                  {x + 1}
                </Link>
              ))
            }
          </>
        </>
      )}
    </>
  );
};

export default AdminProductListPage;
