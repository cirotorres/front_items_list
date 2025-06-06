import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function Items() {
  const [items, setItems] = useState([]);
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const busca = searchParams.get("q") || "";


  useEffect(() => {
    api
      .get("/items", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setItems(res.data))
      .catch((err) => alert("Erro ao buscar itens"));
  }, [token]);


  const deletar = async (item) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o item "${item.name}"?`);
    if (!confirmacao) return;

    try{
    await api.delete(`/items/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    alert("Produto deletado")
    setItems(items.filter((i) => i.id !== item.id));
    }
    catch (err){
      alert("Erro ao deletar item")
    } 
  }


  return (

<div className="container">  
  <div className="row g-4 d-flex flex-wrap">
    <div className="d-flex justify-content-between align-items-center mb-4 w-100">
      <h2 className="mb-0">Lista de Itens</h2>
      {isAdmin ? (
      <div className="btn-group">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/items/new")}
        >
          Novo Item +
        </button>
        <button className="btn btn-outline-primary">
          Carrinho
        </button>
      </div>
      ):(
        <>
        <button className="btn btn-outline-primary">
          Carrinho
        </button>
        </>
      )}
    </div>

    {items
      .filter((item) =>
        item.name.toLowerCase().includes(busca.toLowerCase())
      )
      .map((item) => (
        <div
          className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
          style={{ flex: "0 0 25%" }}
          key={item.id}
        >
          <div className="card h-100 card-hover" style={{ width: "240px" }}>
            {item.images && item.images.length > 0 ? (
              <div
                id={`carousel-${item.id}`}
                className="carousel slide"
                data-bs-ride="carousel"
              >
              {item.images.length > 1 &&(
                <div className="carousel-indicators">
                  {item.images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      data-bs-target={`#carousel-${item.id}`}
                      data-bs-slide-to={idx}
                      className={idx === 0 ? "active" : ""}
                      aria-current={idx === 0 ? "true" : undefined}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
                )}
                <div className="carousel-inner">
                  {item.images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`carousel-item ${idx === 0 ? "active" : ""}`}
                    >
                      <img
                        onClick={() => navigate(`/items/${item.id}`)}
                        src={img.thumb_url}
                        alt={item.name}
                        className="d-block w-100 img-thumbnail"
                        style={{ objectFit: "contain", maxHeight: "150px" }}
                      />
                    </div>
                  ))}
                </div>
                {item.images.length > 1 && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#carousel-${item.id}`}
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        style={{ filter: "invert(1)" }}
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Anterior</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#carousel-${item.id}`}
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        style={{ filter: "invert(1)" }}
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Próximo</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <img
                onClick={() => navigate(`/items/${item.id}`)}
                src="https://placehold.co/250x150?text=No+Image"
                alt=""
                className="img-thumbnail"
                style={{ objectFit: "contain", maxHeight: "150px" }}
              />
            )}

            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text text-muted">R$ {item.price}</p>
              </div>
            {isAdmin ? (
              <>
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-outline-dark"
                  onClick={() => navigate(`/items/${item.id}`)}
                >
                  Info
                </button>

                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => navigate(`/items/${item.id}/edit`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deletar(item)}
                >
                  Excluir
                </button>

              </div>
              </>
              ):(
                <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-info"
                  onClick={() => navigate(`/items/${item.id}`)}
                >
                  Info
                </button>
                <button
                  className="btn btn-outline-success"
                >
                  Add Carrinho
                </button>
                </div>
              )}



            </div>
          </div>
        </div>
      ))}
  </div>
</div>



  );
}
