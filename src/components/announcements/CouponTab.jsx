// src/components/announcements/CouponTab.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CouponTab() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ title: '', description: '', code: '', discount: '' });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    api.get('/announcements', { params: { type: 'coupon' } })
      .then(res => setCoupons(res.data))
      .catch(() => alert('Erro ao carregar cupons'));
  };

  const handleCreate = () => {
    const { title, description, code, discount } = newCoupon;
    if (!title || !code || !discount) return alert('Preencha todos os campos obrigatórios');

    api.post('/announcements', {
      title,
      description,
      position: 0,
      type: 'coupon',
      code,
      discount: parseFloat(discount)
    })
      .then(() => {
        setNewCoupon({ title: '', description: '', code: '', discount: '' });
        loadCoupons();
      })
      .catch(() => alert('Erro ao criar cupom'));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Excluir este cupom?')) return;
    api.delete(`/announcements/${id}`)
      .then(loadCoupons)
      .catch(() => alert('Erro ao excluir'));
  };

  return (
    <div>
      <h5 className="mb-3">Cadastrar Novo Cupom</h5>
      <div className="row g-2 mb-4">
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Título" value={newCoupon.title} onChange={e => setNewCoupon({ ...newCoupon, title: e.target.value })} />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Descrição" value={newCoupon.description} onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })} />
        </div>
        <div className="col-md-2">
          <input type="text" className="form-control" placeholder="Código" value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })} />
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" placeholder="% Desconto" value={newCoupon.discount} onChange={e => setNewCoupon({ ...newCoupon, discount: e.target.value })} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100" onClick={handleCreate}>+</button>
        </div>
      </div>

      <h6>Cupons Existentes:</h6>
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descrição</th>
              <th>Código</th>
              <th>Desconto (%)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.description}</td>
                <td>{c.code}</td>
                <td>{c.discount}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
