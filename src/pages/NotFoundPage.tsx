import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "404: Not Found ";
  }, [
    location.pathname,
  ])
  

  return (
    <div>
      <h1>404</h1>
      <h2>Page '{location.pathname}' not found</h2>
    </div>
  );
};

export default NotFoundPage;
