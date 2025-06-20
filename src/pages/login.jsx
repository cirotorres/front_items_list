// src/pages/Login.jsx

import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/login.css";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password });
      login(res.data.token, email);
      navigate("/items");
    } catch (err) {
      alert("Login inválido");
    }
  };

  const images = [img1, img2, img3];

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 position-relative overflow-hidden">
      {/* Bootstrap background carousel */}
      <div
        id="bgCarousel"
        className="carousel slide carousel-fade position-absolute top-0 start-0 w-100 h-100"
        data-bs-ride="carousel"
        data-bs-interval="4000"
        style={{ zIndex: 0 }}
      >
        <div className="carousel-inner h-100">
          {images.map((img, index) => (
            <div
              key={index}
              className={`carousel-item h-100 ${index === 0 ? "active" : ""}`}
            >
              <div
                className="w-100 h-100"
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1 }}
      ></div>

      {/* login form */}
      <div
        className="card shadow p-4 w-100"
        style={{
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          zIndex: 2,
        }}
      >
        <h2 className="text-center mb-4">Entrar</h2>
        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input
              id="floatingInput"
              className="form-control"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingInput">Email</label>
          </div>

          <div className="form-floating mb-3">
            <input
              id="floatingPassword"
              className="form-control"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Senha</label>
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary w-100">
              Entrar
            </button>
          </div>

          <p className="text-center pt-3">
            Novo por aqui? <a href="/register">Registre-se</a>
          </p>
        </form>
      </div>
    </div>
  );
}
