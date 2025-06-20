import { useNavigate } from "react-router-dom";


export default function ConfigPage() {
const navigate = useNavigate();

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Configurações</h2>

      {/* Configurações da Página */}
      <div className="card mb-4">
        <div className="card-header fw-bold">Configurações da Página</div>
        <div className="card-body d-grid gap-3 col-12 col-md-6 mx-auto">
          <button className="btn btn-primary" type="button">
            Alguma Ação
          </button>
          <button className="btn btn-primary" type="button">
            Mais Configurações
          </button>
        </div>
      </div>

      {/* Configurações do Usuário */}
      <div className="card">
        <div className="card-header fw-bold">Configurações do Usuário</div>
        <div className="card-body d-grid gap-3 col-12 col-md-6 mx-auto">
          <button className="btn btn-outline-primary" type="button"
          onClick={() => navigate("/edit")}
          >
            Alterar Dados
          </button>
        </div>
      </div>
    </div>
  );
}
