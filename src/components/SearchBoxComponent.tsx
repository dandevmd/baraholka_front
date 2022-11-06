import React, { FormEvent, useState, useEffect } from "react";
import { Form, FormGroup, Button, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchBoxComponent = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };

  return (
    <Form className="input-group mb-1 w-50" onSubmit={onSubmitHandler}>
      <input
        type="text"
        className="form-control"
        placeholder="Search Products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        className="btn btn-warning"
        type="submit"
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        <i className="fas fa-search" />
      </Button>
    </Form>
  );
};

export default SearchBoxComponent;
