import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useUserContext } from "../context/userContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { Container, Form, Button, ListGroup } from "react-bootstrap";

const EditProductPage = () => {
  const { user } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [productForm, setProductForm] = useState({
    _id: "",
    name: "",
    slug: "",
    price: "",
    image: "",
    images: [] as string[],
    category: "",
    description: "",
    countInStock: "",
    brand: "",
  });

  useEffect(() => {
    fetchProductById(id!);
  }, [id]);

  const fetchProductById = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/products/${id}`, {
          headers: {
            Authorization:
              user && `Bearer ${user.token} ${user._id} ${user.isAdmin} `,
          },
        }
      );
      if (!data) {
        return toast.error("Product not found");
      }

      setProductForm(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      console.log(error);
    }
    setLoading(false);
  };

  const editProductHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/admin/editProduct/${productForm?._id}`,
        productForm,
        {
          headers: {
            Authorization: `Bearer ${user?.token} ${user?._id} ${user?.isAdmin}`,
          },
        }
      );
      if (!data) {
        return toast.error("Product not edited");
      }

      toast.success("Product edited");
      navigate("/product/" + productForm.slug);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      }
      console.log(error);
    }
    setLoading(false);
  };

  const uploadImageHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    forImages?: boolean
  ) => {
    const file = e?.target?.files![0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/upload`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${user?.token} ${user?._id} ${user?.isAdmin}`,
          },
        }
      );
      if (!data) {
        return toast.error("Image not uploaded");
      }

      if (forImages) {
        setProductForm({
          ...productForm,
          images: [...productForm.images, data.secure_url],
        });
      } else {
        setProductForm({ ...productForm, image: data?.secure_url });
      }

      toast.success("Image uploaded successfully");
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const deleteFileHandler = async (fileName: string) => {
   return setProductForm({
      ...productForm,
      images: productForm.images.filter((image) => image !== fileName),
    });
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Container className="small-container">
          <h1>Edit Product {productForm._id}</h1>

          <Form onSubmit={editProductHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="slug">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                value={productForm.slug}
                onChange={(e) =>
                  setProductForm({ ...productForm, slug: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Price</Form.Label>
              <Form.Control
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Image File</Form.Label>
              <Form.Control
                value={productForm.image}
                onChange={(e) =>
                  setProductForm({ ...productForm, image: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="imageFile">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" onChange={uploadImageHandler} />
            </Form.Group>{" "}
            <Form.Group className="mb-3" controlId="additionalImage">
              <Form.Label>Additional Images</Form.Label>
              <ListGroup>
                {productForm.images.length > 0 &&
                  productForm.images.map((img: string) => (
                    <ListGroup.Item key={img}>
                      {img}
                      <Button
                        variant="light"
                        onClick={() => deleteFileHandler(img)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Upload Additional Images</Form.Label>
              <Form.Control
                type="file"
                //@ts-ignore
                onChange={(e) => uploadImageHandler(e, true)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={productForm.category}
                onChange={(e) =>
                  setProductForm({ ...productForm, category: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                value={productForm.brand}
                onChange={(e) =>
                  setProductForm({ ...productForm, brand: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                value={productForm.countInStock}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    countInStock: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Button type="submit" className="btn btn-warning mt-3">
              Update
            </Button>
          </Form>
        </Container>
      )}
    </>
  );
};

export default EditProductPage;
