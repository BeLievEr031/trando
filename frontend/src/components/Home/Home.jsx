import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (
      !window.localStorage.getItem("token") ||
      !window.localStorage.getItem("user")
    ) {
      return navigate("/auth");
    }
    setUser(JSON.parse(window.localStorage.getItem("user")));
  }, []);

  return (
    <>
      {user ? (
        <div>
          <img
            src={`http://localhost:5000/img/${user.imgPath}/${
              user ? user.email : ""
            }.jpeg`}
            alt=""
          />
          <h1>name: {user.name}</h1>
          <h1>email: {user.email}</h1>
          <h1>phone: {user.phone}</h1>
          <button onClick={()=>{
            window.localStorage.removeItem("user")
            window.localStorage.removeItem("token")
            navigate("/auth")
          }}>logout</button>
        </div>
      ) : (
        <h1>loading..</h1>
      )}
    </>
  );
}

export default Home;
