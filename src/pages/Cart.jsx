// src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../css/cart.css";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("cart");
  const { token } = useAuth();
  const navigate = useNavigate();

  const loadCart = React.useCallback(() => {
    api.get('/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const sortedItems = res.data.items.sort((a, b) => a.item_id - b.item_id);
        setCart(res.data.cart);
        setItems(sortedItems);
        window.dispatchEvent(new Event("cart:updated"));
      })
      .catch(err => {
        console.error('Erro ao carregar carrinho', err);
      });
  }, [token]);

  const loadOrders = React.useCallback(() => {
    api.get('/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error("Erro ao carregar pedidos", err));
  }, [token]);

  useEffect(() => {
    if (token) {
      loadCart();
      loadOrders();
    }
  }, [token, loadCart, loadOrders]);

  const finalizeCart = () => {
    api.post('/cart/finalize', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert('Pedido finalizado!');
        loadCart();
        loadOrders();
      })
      .catch(() => alert('Erro ao finalizar pedido'));
  };

  const updateQuantity = (itemId, delta) => {
    const item = items.find(i => i.item_id === itemId);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) return removeItem(itemId);

    api.post('/cart/add_item', {
      user_id: 1,
      item_id: itemId,
      quantity: delta,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(loadCart)
      .catch(() => alert('Erro ao atualizar quantidade'));
  };

  const removeItem = (itemId) => {

    const confirmacao = window.confirm(`Tem certeza que deseja deletar o item?` )
    if (!confirmacao) return ;

    api.delete('/cart/remove_item', {
      data: { user_id: 1, item_id: itemId },
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(loadCart)
      .catch(() => alert('Erro ao remover item'));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="cart-wrapper py-5">
      <div className="container">
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "cart" ? "active" : ""}`} onClick={() => setActiveTab("cart")}>Carrinho</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>Histórico</button>
          </li>
        </ul>

        {activeTab === "cart" ? (
          cart ? (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Shopping Cart</h4>
                  <span className="text-muted">{items.length} items</span>
                </div>

                <div className="d-flex flex-column gap-3">
                  {items.map(item => (
                    <div key={item.item_id} className="product-card p-3 shadow-sm">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <img src={item.images?.[0]?.thumb_url || "https://placehold.co/100x100?text=No+Image"} alt={item.name} className="img-thumbnail w-100" style={{ objectFit: "contain", maxHeight: "100px" }} />
                        </div>
                        <div className="col-md-4">
                          <h6 className="mb-1">{item.name}</h6>
                          <p className="text-muted mb-0">{item.description || "Produto"}</p>
                        </div>
                        <div className="col-md-3">
                          <div className="d-flex align-items-center gap-2">
                            <button className="quantity-btn" onClick={() => updateQuantity(item.item_id, -1)}>-</button>
                            <input type="number" className="quantity-input" value={item.quantity} readOnly min="1" />
                            <button className="quantity-btn" onClick={() => updateQuantity(item.item_id, 1)}>+</button>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <span className="fw-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="col-md-1">
                          <button className="btn btn-outline-danger" onClick={() => removeItem(item.item_id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                          </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-outline-secondary mt-4" onClick={() => navigate('/items')}>
                  ← Continuar comprando
                </button>
              </div>

              <div className="col-lg-4">
                <div className="summary-card p-4 shadow-sm">
                  <h5 className="mb-4">Resumo do Pedido</h5>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Subtotal</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Desconto</span>
                    <span className="text-success">- R$ 0,00</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Frete</span>
                    <span>R$ 0,00</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold">R$ {total.toFixed(2)}</span>
                  </div>

                  <button className="btn btn-primary w-100 mb-3" onClick={finalizeCart}>Finalizar Compra</button>
                  <div className="d-flex justify-content-center gap-2">
                    <i className="bi bi-shield-check text-success"></i>
                    <small className="text-muted">Checkout seguro</small>
                  </div>
                </div>
              </div>
            </div>
          ) : <p>Carregando carrinho...</p>
        ) : (
          <div className="order-history">
            {orders.length === 0 ? <p>Nenhum pedido encontrado.</p> : (
              orders.map(order => (
                <div key={order.id} className="order border rounded p-3 mb-4">
                  <div className="d-flex justify-content-between">
                    <strong>Pedido #{order.id}</strong>
                    <span className="text-muted">{order.created_at}</span>
                  </div>
                  <p><strong>Total:</strong> R$ {order.total_price.toFixed(2)} ({order.item_count} itens)</p>
                  <ul className="list-group mt-3">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img src={item.images?.[0]?.thumb_url || "https://placehold.co/100x100?text=No+Image"} alt={item.name} className="img-thumbnail me-3" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
                          <div>
                            <strong>{item.name}</strong>
                            <p className="mb-0">Qtd: {item.quantity} × R$ {item.price}</p>
                          </div>
                        </div>
                        <span className="fw-bold">R$ {item.subtotal.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
