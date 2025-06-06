import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [adm, setAdm] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("As senhas não coincidem");
            return;
        }
        try {
            await api.post("/register", {
            user: {
                email,
                password,
                adm
            }
            });
            alert("Usuário registrado com sucesso!");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            navigate("/")
        } catch (err) {
            alert("Erro ao registrar usuário");
        }
    }


    return (
        
        <div className="login-container">
        <h2>Cadastro</h2>
            <form onSubmit={handleRegister} className="p-4 shadow rounded bg-white">
                
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                       placeholder="Email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />

                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                       placeholder="Senha"
                       value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                       
                    />

                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                       placeholder="Confirmar Senha"
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                </div>
                <div className="d-flex gap-5 mb-3 justify-content-center">
                    <div class="form-check">
                    <input 
                    className="form-check-input" 
                    type="radio" 
                    name="userType" 
                    id="funcionario" 
                    value="false"
                    onChange={() => setAdm(false)}
                    checked={!adm}
                    />

                    <label class="form-check-label" for="flexRadioDefault1">
                        Funcionário
                    </label>

                    </div>
                 

                    <div className="form-check">
                    <input className="form-check-input" 
                    type="radio" 
                    name="userType" 
                    id="administrador"  
                    value="true"
                    onChange={() =>setAdm(true)}
                    checked={adm}
                    />


                    <label className="form-check-label" for="flexRadioDefault2">
                        Administrador
                    </label>
                    </div>
                </div>
                <button type="submit"className="btn btn-primary w-50">Cadastrar</button>
            </form>

        </div>
    )

}
