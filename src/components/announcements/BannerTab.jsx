import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export default function BannerTab() {
  const [banners, setBanners] = useState([]);
  const [newBanner, setNewBanner] = useState({ title: '', description: '', images: [] });
  const [editingId, setEditingId] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const { token } = useAuth();

  const loadBanners = React.useCallback(() => {
    api.get('/announcements', {
      headers: { Authorization: `Bearer ${token}` },
      params: { type: 'banner' },
    })
      .then(res => setBanners(res.data))
      .catch(err => console.error('Erro ao carregar banners', err));
  }, [token]);

  useEffect(() => { loadBanners(); }, [token, loadBanners]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewBanner({
      ...newBanner,
      images: [...newBanner.images, ...selectedFiles],
    });
  };

  const handleCreate = () => {
    if (!newBanner.title || newBanner.images.length === 0)
      return alert('Preencha título e imagem');

    if (banners.length >= 5)
      return alert('Máximo de 5 banners permitidos.');

    const formData = new FormData();
    formData.append('announcement[title]', newBanner.title);
    formData.append('announcement[description]', newBanner.description);
    formData.append('announcement[type]', 'banner');
    formData.append('announcement[position]', banners.length + 1);

    newBanner.images.forEach(img => formData.append('images[]', img));

    api.post('/announcements', formData, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setNewBanner({ title: '', description: '', images: [] });
        document.getElementById('banner-file').value = null;
        loadBanners();
      })
      .catch(() => alert('Erro ao criar banner'));
  };

  const handleSaveDescription = async (id) => {
    try {
      await api.patch(`/announcements/${id}`, {
        announcement: { description: editedDescription }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      loadBanners();
    } catch (err) {
      console.error('Erro ao salvar descrição', err);
      alert('Erro ao salvar descrição');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Deseja realmente excluir este banner?')) return;
    api.delete(`/announcements/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(loadBanners)
      .catch(() => alert('Erro ao excluir'));
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = banners.findIndex(b => b.id === active.id);
    const newIndex = banners.findIndex(b => b.id === over.id);

    const reordered = arrayMove(banners, oldIndex, newIndex);
    setBanners(reordered);

    reordered.forEach((banner, index) => {
      api.patch(`/announcements/${banner.id}`, {
        announcement: { position: index + 1 },
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });
  };

  return (
    <div>
      <h5 className="mb-3">Cadastrar Novo Banner</h5>
      <div className="row g-2 mb-4">
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Título"
            value={newBanner.title}
            onChange={e => setNewBanner({ ...newBanner, title: e.target.value })} />
        </div>
        <div className="col-md-4">
          <textarea type="text" className="form-control" placeholder="Descrição"
            value={newBanner.description}
            onChange={e => setNewBanner({ ...newBanner, description: e.target.value })} />
        </div>
        <div className="col-md-3">
          <input type="file" id="banner-file"
            className="form-control" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="col-md-1">
          <button className="btn btn-success w-100" onClick={handleCreate}>+</button>
        </div>
      </div>
      <p style={{color:"grey"}}>Dimensão banners: 200x1400 </p>

      <h6>Banners Existentes:</h6>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={banners.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="row g-3">
            {banners.map((b) => (
              <SortableItem key={b.id} id={b.id}>
                <div className="mb-3 row">
                  <div className='col-md-6'>
                    <div className="card shadow-sm">
                      <img src={b.images[0]} alt={b.title} className="card-img-top img-fluid"
                        style={{ objectFit: 'cover', maxHeight: '100px' }} />
                      <div className="card-body">
                        <h6 className="card-title">{b.title}</h6>
                        <button className="btn btn-danger btn-sm w-100" onClick={() => handleDelete(b.id)}>
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className="mb-3 p-3">
                      <p>Descrição do anúncio:</p>
                      <textarea
                        type="text"
                        className="form-control"
                        value={editingId === b.id ? editedDescription : b.description}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        disabled={editingId !== b.id}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveDescription(b.id);
                          }
                        }}
                        placeholder="Descrição do produto"
                        style={{ height: "100px" }}
                      />
                      {editingId === b.id ? (
                        <button className="btn btn-sm btn-outline-success mt-2" onClick={() => handleSaveDescription(b.id)}>
                          Salvar
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => {
                          setEditedDescription(b.description);
                          setEditingId(b.id);
                        }}>
                          ✏️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
