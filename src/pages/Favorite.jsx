// src/pages/Favorites.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/favorites', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {setFavorites(res.data);
        console.log("Objeto do FAV:",res.data);
      })
      
      .catch(err => console.error('Erro ao carregar favoritos', err));
  }, [token]);

  const removeFromFavorites = (itemId) => {
    const confirmacao = window.confirm(`Remover o item dos Favoritos?` )
    if (!confirmacao) return ;

    api.delete(`/favorites/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setFavorites(favorites.filter(item => item.item_id !== itemId)))
      .catch(() => alert('Erro ao remover favorito'));
  };

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
    <div className="container py-5">
      <h2 className="mb-4">Seus Favoritos</h2>
      {favorites.length === 0 ? (
        <p>Você ainda não tem favoritos.</p>
      ) : (
        <div className="row g-4">   
          {favorites.map(item => (
            <div key={item.item_id} className="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
              <div className="card h-100 card-hover" style={{ width: '240px', cursor:"pointer" }} >
                <img
                  onClick={() => navigate(`/items/${item.item_id}`)}
                  src={item.images?.[0]?.thumb_url || "https://placehold.co/250x150?text=No+Image"}
                  className="card-img-top img-thumbnail"
                  alt={item.name}
                  style={{ objectFit: "contain", maxHeight: "180px" }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text text-muted">{item.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0">R$ {item.price}</span>
                  
                  <div className='btn-group'>
                    <button className="btn btn-outline-danger" onClick={() => removeFromFavorites(item.item_id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                    </button>
                      <button className="btn btn-outline-primary" onClick={() => {addToCart(item.item_id)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart-plus" viewBox="0 0 16 16">
                        <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                      </svg>
                      </button>
                      </div>
                      </div>
                      </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


