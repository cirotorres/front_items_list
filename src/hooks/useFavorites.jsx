// src/hooks/useFavorites.js
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      api.get('/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setFavorites(res.data))
      .catch(() => setFavorites([]));
    }
  }, [token]);

  const isFavorited = (itemId) => {
    return favorites.some(fav => fav.item_id === itemId);
  };

  const toggleFavorite = (itemId) => {
    if (isFavorited(itemId)) {

      api.delete(`/favorites/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        setFavorites(prev => prev.filter(fav => fav.item_id !== itemId));
      });
    } else {
      api.post('/favorites/add_item', { item_id: itemId }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setFavorites(prev => [...prev, res.data.favorite]);
      });
    }
  };

  return { favorites, isFavorited, toggleFavorite };
}
