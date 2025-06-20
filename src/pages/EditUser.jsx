// src/pages/EditUser.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function EditUser() {
  const { token, email: Authemail } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    try{
        setEmail(Authemail);}
    catch{
        alert ("Erro ao pegar dados do usuário")
        };

  }, [ Authemail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    try {
      await api.patch(
        "/me",
        { user: { email, password } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Dados atualizados com sucesso!");
      navigate("/items");
    } catch {
      alert("Erro ao atualizar os dados");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Editar Meus Dados</h2>
      <form className="col-12 col-md-6 mx-auto" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nova Senha</label>
          <input
            type="password"
            className="form-control"
            placeholder="Nova senha (opcional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Confirmar Nova Senha</label>
          <input
            type="password"
            className="form-control"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
