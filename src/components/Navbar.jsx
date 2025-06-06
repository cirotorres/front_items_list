import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout, email } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const showSearch = location.pathname === "/items";
  const busca = searchParams.get("q") || "";

  const handleChange = (e) => {
    setSearchParams({ q: e.target.value });
  };

  const sair = () => {
    const confirmacao = window.confirm("Deseja sair?");
    if (!confirmacao) return;
    logout();
    navigate("/");
  };

  


  return (
<nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
  <div className="container">
    <Link className="navbar-brand" to="/items">ItemList</Link>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto align-items-center gap-3">
        {token && (
          <>
            {showSearch && (
              <li className="nav-item">
                <form className="d-flex">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Pesquisar"
                    aria-label="Search"
                    value={busca}
                    onChange={handleChange}
                  />
                </form>
              </li>
            )}

            <li className="nav-item dropdown">
              <button
                className="btn btn-link nav-link dropdown-toggle"
                id="userDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Olá, <strong>{email.split("@")[0]}</strong>
              </button>

              <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="userDropdown">
                <li><button className="dropdown-item" type="button">Perfil</button></li>
                <li><button className="dropdown-item" type="button">Configurações</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" type="button" onClick={sair}>Sair</button></li>
              </ul>
            </li>
          </>
        )}
      </ul>
    </div>
  </div>
</nav>

  );
}
