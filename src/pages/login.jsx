import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/login.css";

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

  return (
<div className="login-container d-flex flex-column align-items-center justify-content-center">
  <h2 className="mb-4">Entrar</h2>
  <form onSubmit={handleLogin} className="w-100" style={{ maxWidth: "400px" }}>
    <div className="form-floating mb-3">
      <input 
        id="floatingInput"
        className="form-control" 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="floatingInput">Email</label>
    </div>

    <div className="form-floating mb-3">
      <input 
        id="floatingPassword"
        className="form-control" 
        type="password" 
        placeholder="Senha" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} />
      <label htmlFor="floatingPassword">Senha</label>
    </div>

    <div className="d-flex justify-content-center">
      <button type="submit" className="btn btn-primary w-50">
        Entrar
      </button>
    </div>

    <p className="text-center pt-3">
      Novo por aqui? <a href="/register">Registre-se</a>
    </p>
  </form>
</div>

  );
}
