import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Auth() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [authType, setAuthType] = useState("sign");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSetUser = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUP = async () => {
    console.log(userData);
    console.log(file);
    try {
      const data = new FormData();
      data.append("image", file);

      if (
        !file ||
        userData.email === "" ||
        userData.phone === "" ||
        userData.password === "" ||
        userData.name === ""
      ) {
        return alert("all fields required");
      }

      let res = await axios({
        method: "post",
        url: `http://localhost:5000/upload`,
        data,
        headers: {
          img_name: userData.email,
        },
      });

      res = res.data;

      if (!res.success) {
        return alert("something went wrong");
      }

      res = await axios({
        method: "post",
        url: `http://localhost:5000/signup`,
        data: userData,
      });

      res = res.data;

      if (!res.success) {
        return alert(res.msg);
      }

      setAuthType("login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      if (loginData.email === "" || loginData.password === "") {
        return alert("all fields required");
      }

      let res = await axios({
        method: "post",
        url: "http://localhost:5000/login",
        data: loginData,
      });

      console.log(res.data);
      res = res.data;

      if (!res.success) {
        return alert(res.msg);
      }

      window.localStorage.setItem("user", JSON.stringify(res.user));
      window.localStorage.setItem("token", res.token);
      navigate("/home");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {authType === "sign" ? (
        <div>
          <input
            type="file"
            name="image"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <input
            type="text"
            name="name"
            placeholder="enter name"
            onChange={(e) => handleSetUser(e)}
          />

          <input
            type="email"
            name="email"
            placeholder="enter email"
            onChange={(e) => handleSetUser(e)}
          />
          <input
            type="number"
            name="phone"
            placeholder="enter phone"
            onChange={(e) => handleSetUser(e)}
          />
          <input
            type="password"
            name="password"
            placeholder="enter password"
            onChange={(e) => handleSetUser(e)}
          />
          <button onClick={handleSignUP}>click</button>
          <button
            onClick={() => {
              setAuthType("login");
            }}
          >
            login
          </button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            placeholder="enter email"
            name="email"
            onChange={(e) =>
              setLoginData({
                ...loginData,
                [e.target.name]: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="enter password"
            name="password"
            onChange={(e) =>
              setLoginData({
                ...loginData,
                [e.target.name]: e.target.value,
              })
            }
          />
          <button onClick={handleLogin}>login</button>
          <button
            onClick={() => {
              setAuthType("sign");
            }}
          >
            create account
          </button>
        </div>
      )}
    </>
  );
}

export default Auth;
