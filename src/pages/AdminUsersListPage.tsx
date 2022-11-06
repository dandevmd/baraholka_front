import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { User } from "../types";
import Loader from "../components/Loader";
import axios from "axios";

const AdminUsersListPage = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usersState, setUsersState] = useState({
    users: [] as User[],
    countUsers: 0,
    pages: 1,
  });
  const location = useLocation();
  const sp = new URLSearchParams(location.search);
  const page = sp.get("page") || 1;

  useEffect(() => {
    fetchUsers();
  }, [user, page, usersState.countUsers, usersState.pages]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/admin/usersList?page=${page}`,
        {
          headers: {
            Authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin}`,
          },
        }
      );
      data &&
        setUsersState({
          users: data.users,
          countUsers: data.countDocuments,
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

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/admin/deleteUser`,
        {
          headers: {
            Authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin}`,
          },
          data: { id },
        }
      );
      if (!data) {
        toast.error("User not deleted");
      }
      setUsersState({
        ...usersState,
        users: usersState.users.filter((user) => user._id !== id),
      });
      toast.success("User deleted");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
      console.log(error);
    }
    setLoading(false);
  };


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1>Users Stats</h1>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>USER_ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>IS ADMIN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {usersState.users &&
                usersState.users.map((u) => (
                  <tr key={u?._id}>
                    <td>{u?._id}</td>
                    <td>{u?.name}</td>
                    <td>{u?.email}</td>
                    <td>{u?.isAdmin ? "ADMIN" : "NO"} </td>

                    <td>
                      <div className="d.flex justify-content-between align-items-center">
                        <Link
                          to={`/userList/${u?._id}`}
                          className="btn btn-light"
                        >
                          Edit User Data
                        </Link>
                        <button
                          className="btn btn-danger mx-2"
                          onClick={() => handleDelete(u?._id)}
                        >
                          Delete
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
              [...Array(usersState.pages).keys()].map((x) => (
                <Link
                  className={
                    x + 1 === Number(page)
                      ? "btn btn-secondary text-bold"
                      : "btn"
                  }
                  key={x + 1}
                  to={`/userList?page=${x + 1}`}
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

export default AdminUsersListPage;
