import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import BannerCarosel from "../components/BannerCarosel";
import useFavorites from "../hooks/useFavorites";

export default function Items() {
  const [items, setItems] = useState([]);
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const busca = searchParams.get("q") || "";
  const { isFavorited, toggleFavorite } = useFavorites();


  useEffect(() => {
    api
      .get("/items", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>{
        const sortedItems = res.data.sort((a, b) => a.item_id - b.item_id);
        console.log("Resposta item:", res.data) 
         setItems(sortedItems)})
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

  // const addToFavorite = (itemId) => {
  //   api.post('/favorites/add_item', { 
  //     item_id: itemId,
  //   }, {
  //     headers: { Authorization: `Bearer ${token}` }
  //   })
  //   .then(() => {
  //     alert('Item favoritado.');
  //   })
  //   .catch(() => alert('Erro ao favoritar o item'));
  // };

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
      </div>
      ):(
        <>

        </>
      )}
    </div>
     <BannerCarosel/>
    {items
      .filter((item) =>
        item.name.toLowerCase().includes(busca.toLowerCase())
      )
      .map((item) => (
        <div
          className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
          style={{ flex: "0 0 20%" }}
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
                        style={{ objectFit: "contain", maxHeight: "180px" }}
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
                <p className="card-text text-muted">{item.description}</p>
              
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="h5 mb-0">R$ {item.price}</span>
                        <div className="btn-group">
                        <button className="btn btn-outline-danger" onClick={() => {toggleFavorite(item.id)}}>
                        {isFavorited(item.id) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                            </svg>
                          ):(
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                            </svg>
                          )}
                        </button>
                      <button className="btn btn-outline-primary" onClick={() => {addToCart(item.id)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart-plus" viewBox="0 0 16 16">
                          <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
                          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                        </svg>
                      </button>
                      </div>
                    </div>
          
              </div>
            {isAdmin ? (
              <>
              <div className="d-flex justify-content-between mt-3">

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
