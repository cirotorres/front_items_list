import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./DarkMode";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Navbar() {
  const { token, logout, email } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cartCount, setCartCount] = useState(0);

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

useEffect(() => {
  const fetchCart = () => {
    if (token) {
      api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setCartCount(res.data.cart.item_count);
      });
    }
  };

  window.addEventListener("cart:updated", fetchCart);
  fetchCart(); // inicial

  return () => window.removeEventListener("cart:updated", fetchCart);
}, [token]);

  
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

                  <li className="nav-item position-relative">
                    <a href="/cart" className="nav-link text-light">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-cart2 cart-icon"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                      </svg>
                      {cartCount > 0 && (
                        <span className="position-absolute start-90 translate-middle badge rounded-pill bg-danger">
                          {cartCount}
                        </span>
                      )}
                    </a>
                  </li>

            <li className="nav-item d-flex align-items-center">
              <ThemeToggle />
            </li>

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
                <li><button className="dropdown-item" type="button" onClick={() => navigate("/config")}>Configurações</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => navigate("/favorite")}>Favoritos</button></li>
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
