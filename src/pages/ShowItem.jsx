import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

export default function ShowItem() {
  const [item, setItem] = useState(null);
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setItem(res.data))
      .catch(() => {
        alert("Item não encontrado");
        navigate("/items");
      });
  }, [id, token, navigate]);

  if (!item) return null;

  return (
    <div className="container my-5">
      <div className="card shadow text-center">
        
        {item.images && item.images.length > 0 && (
          <div
            id="itemCarousel"
            className="carousel slide"
            data-bs-touch="true"
            data-bs-interval="false"
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
            {item.images.length > 1 &&(
              <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carousel-${item.id}`}
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true" style={{filter: "invert(1)"}}></span>
                <span className="visually-hidden">Anterior</span>
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carousel-${item.id}`}
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"style={{filter: "invert(1)"}}></span>
                <span className="visually-hidden">Próximo</span>
              </button> 
              </>
              )}
              
              {item.images.map((img, idx) => (
                <div
                  key={img.id}
                  className={`carousel-item ${idx === 0 ? "active" : ""}`}
                >
                  <img
                    src={img.url}
                    alt={`Imagem ${idx + 1}`}
                    className="d-block w-100 img-thumbnail"
                    style={{ objectFit: "scale-down", maxHeight: "300px" }}
                  />
                </div>
              ))}
            </div>
            {item.images.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#itemCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#itemCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        )}

        <div className="card-body">
          <h2 className="card-title">{item.name}</h2>
          <p className="text-muted">Preço: R$ {item.price}</p>
          <p className="card-text">{item.description || "Sem descrição."}</p>

          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/items")}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
