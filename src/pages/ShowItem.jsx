import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";

export default function ShowItem() {
  const [item, setItem] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const { token, isAdmin } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const { isFavorited, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.data) {
          setItem(res.data);
          // Define imagem principal ou usa fallback
          const mainImageUrl = res.data.images?.[0]?.url || "";
          setMainImage(mainImageUrl);
        } else {
          alert("Item não encontrado");
          navigate("/items");
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar item:", err);
        alert("Erro ao carregar detalhes do item.");
        navigate("/items");
      });
  }, [id, token, navigate]);

  const deletar = async (item) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o item "${item.name}"?`);
    if (!confirmacao) return;

    try {
      await api.delete(`/items/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Produto deletado");
      navigate("/items");
    } catch (err) {
      alert("Erro ao deletar item");
    }
  };

  const addToCart = (itemId, quantity) => {
    api.post("/cart/add_item", {
      user_id: 1,
      item_id: itemId,
      quantity: quantity,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert("Item adicionado ao carrinho");
      window.dispatchEvent(new Event("cart:updated"));
    })
    .catch(() => alert("Erro ao adicionar item"));
  };

  // Mostrar loading enquanto busca dados
  if (!item) {
    return (
      <div className="container mt-5 text-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mb-4">
          {/* Imagem principal */}
          <img
            src={mainImage || "https://placehold.co/250x150?text=No+Image"}
            alt="Produto"
            className="img-fluid rounded mb-3 product-image"
            id="mainImage"
          />

          {/* Miniaturas */}
          <div className="d-flex justify-content-between flex-wrap">
            {item.images && item.images.length > 0 ? (
              item.images.map((img, idx) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`thumbnail rounded ${mainImage === img.url ? "active" : ""}`}
                  onClick={() => setMainImage(img.url)}
                />
              ))
            ) : (
              <img
                src="https://placehold.co/50x50?text=No+Image"
                alt="Sem imagem"
                className="thumbnail rounded"
                style={{ opacity: 1 }}
              />
            )}
          </div>
        </div>

        {/* Detalhes do produto */}
        <div className="col-md-6">
          <h2 className="mb-3">{item.name}</h2>
          <p className="text-muted mb-4">ID: {item.id}</p>

          <div className="mb-3">
            <span className="h4 me-2">R$ {item.price}</span>
          </div>

          <p className="mb-4">{item.description || "Sem descrição."}</p>

          <div className="mb-4">
            <label htmlFor="quantity" className="form-label">Quantidade:</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              min="1"
              style={{ width: "80px" }}
              onChange={(e) => setQuantity(Number(e.target.value))}
              value={quantity}
            />
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => addToCart(item.id, quantity)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart-plus" viewBox="0 0 16 16">
                  <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
                  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                </svg> Add ao Carrinho
            </button>
            <button className="btn btn-outline-danger btn-lg" onClick={() => {toggleFavorite(item.id)}}>
              {isFavorited(item.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                  </svg>
                ):(
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                  </svg>
                )} Favorito
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate("/items")}
            >
              Voltar
            </button>
            {isAdmin && (
              <>
                <button
                  className="btn btn-warning btn-lg"
                  onClick={() => navigate(`/items/${item.id}/edit`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-lg"
                  onClick={() => deletar(item)}
                >
                  Excluir
                </button>
              </>
            )}
          </div>

          <div className="mt-4">
            <h5>Detalhes:</h5>
            <ul>
              <li>Categoria: {item.category || "N/A"}</li>
              <li>Estoque: {item.stock || "N/A"}</li>
              <li>ID do Produto: {item.id}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Estilos customizados */}
      <style>{`
        .product-image {
          width: 100%;
          max-height: 400px;
          object-fit: contain;
          margin-bottom: 1rem;
          border-radius: 0.5rem;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.3s ease;
          margin-top: 10px;
        }

        .thumbnail:hover,
        .thumbnail.active {
          opacity: 1;
          border: 2px solid #007bff; 
        }
      `}</style>
    </div>
  );
}