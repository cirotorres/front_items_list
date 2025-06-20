import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

export default function ShowItem() {
  const [item, setItem] = useState(null);
  const { token, isAdmin } = useAuth();
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

  const deletar = async (item) => {
  const confirmacao = window.confirm(`Tem certeza que deseja excluir o item "${item.name}"?`);
  if (!confirmacao) return;

  try{
  await api.delete(`/items/${item.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  alert("Produto deletado")
  navigate("/items")
  }
  catch (err){
    alert("Erro ao deletar item")
  } 
}

  const addToCart = (itemId) => {
    api.post('/cart/add_item', {
      user_id: 1,
      item_id: itemId,
      quantity: 1,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('Item adicionado ao carrinho');
      window.dispatchEvent(new Event("cart:updated"));
    })
    .catch(() => alert('Erro ao adicionar item'));
  };

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
        {isAdmin ? (
        <div className="d-flex justify-content-center mt-2">
           <>
           <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/items")}
            >
            Voltar
          </button>

          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate(`/items/${item.id}/edit`)}
          >
            Editar
          </button>

          <button
            className="btn btn-secondary mt-3"
            onClick={() => deletar(item)}
          >
            Excluir
          </button>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => addToCart(item.id)}
          >
            Add carrinho
          </button>       
          <button
            className="btn btn-secondary mt-3"

          >
            Favorito
          </button>          
          </>
        </div>
          ):(
            <>
            <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/items")}
          >
            Voltar
          </button>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => addToCart(item.id)}
          >
            Add carrinho
          </button> 
          <button
            className="btn btn-secondary mt-3"

          >
            Favorito
          </button> 
            </>

          )}

        </div>
      </div>
    </div>
  );
}
