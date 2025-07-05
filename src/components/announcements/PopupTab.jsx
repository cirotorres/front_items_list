// src/components/announcements/PopupTab.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function PopupTab() {
  const [popups, setPopups] = useState([]);
  const [newPopup, setNewPopup] = useState({ title: '', description: '', images: [] });

  useEffect(() => {
    loadPopups();
  }, []);

  const loadPopups = () => {
    api.get('/announcements', { params: { type: 'popup' } })
      .then(res => setPopups(res.data))
      .catch(() => alert('Erro ao carregar popups'));
  };

  const handleFileChange = (e) => {
    setNewPopup({ ...newPopup, images: Array.from(e.target.files) });
  };

  const handleCreate = () => {
    if (!newPopup.title || newPopup.images.length === 0) return alert('Preencha título e imagem');
    const formData = new FormData();
    formData.append('title', newPopup.title);
    formData.append('description', newPopup.description);
    formData.append('type', 'popup');
    newPopup.images.forEach(img => formData.append('images[]', img));

    api.post('/announcements', formData)
      .then(() => {
        setNewPopup({ title: '', description: '', images: [] });
        document.getElementById('popup-file').value = null;
        loadPopups();
      })
      .catch(() => alert('Erro ao criar popup'));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Deseja realmente excluir este popup?')) return;
    api.delete(`/announcements/${id}`)
      .then(loadPopups)
      .catch(() => alert('Erro ao excluir'));
  };

  return (
    <div>
      <h5 className="mb-3">Cadastrar Novo Pop-up</h5>
      <div className="row g-2 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Título"
            value={newPopup.title}
            onChange={e => setNewPopup({ ...newPopup, title: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Descrição"
            value={newPopup.description}
            onChange={e => setNewPopup({ ...newPopup, description: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="file"
            multiple
            id="popup-file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="col-md-1">
          <button className="btn btn-success w-100" onClick={handleCreate}>+</button>
        </div>
      </div>

      <h6>Pop-ups Existentes:</h6>
      <div className="row g-3">
        {popups.map(p => (
          <div className="col-md-4" key={p.id}>
            <div className="card shadow-sm">
              <img src={p.images[0]} alt={p.title} className="card-img-top img-fluid" style={{ objectFit: 'cover', maxHeight: '200px' }} />
              <div className="card-body">
                <h6 className="card-title">{p.title}</h6>
                <p className="card-text small text-muted">{p.description}</p>
                <button className="btn btn-danger btn-sm w-100" onClick={() => handleDelete(p.id)}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
