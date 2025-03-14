"use client";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "./page.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checklogin, setCheckLogin] = useState(null);
  const [animateOut, setAnimateOut] = useState(false);
  const [animateouttop, setAnimateOutTop] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://10.15.0.23:5006/api/Login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const response = await res.json();

      if (response === true) {
        setAnimateOut(true);
        setAnimateOutTop(true);
        localStorage.setItem('username', JSON.stringify({ username }));
        localStorage.setItem('password', JSON.stringify({ password }));
        setTimeout(() => {
          router.push("/Components/Product");
        }, 700);
      } else {
        setCheckLogin(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const keyenter = () => {
    if (event.key === "Enter") {
      handleLogin();
    }
  }
  
  console.log(username)
  console.log(password)

  return (
    <div className="container mt-5 p-5">
      <div className="row">
        <div className={`col-12 ${animateouttop ? "slide-out-top" : ""}`} align="center">
          <Image
            className="Logo-img"
            src={"/img/Logo.jpg"}
            width={1000}
            height={150}
          />
        </div>
        <div className="col-12">
          <div
            className={`card p-4 form-login ${
              animateOut ? "slide-out-right" : ""
            }`}
          >
            {checklogin === false && (
              <div className="card mx-5 animation-error">
                <div className="card-body text-center login-fail">
                  <h5>Username หรือ Password ไม่ถูกต้อง</h5>
                </div>
              </div>
            )}
            <div className="card-body mt-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setUsername(e.target.value)}
              />
              <label className="mt-2">Password</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={keyenter}
              />
              <div className="mt-3 d-flex justify-content-center">
                <button className="btn btn-danger" onClick={handleLogin}>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
