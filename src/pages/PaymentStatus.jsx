import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PaymentStatus() {
  const [paymentStatus, setPaymentStatus] = useState(null); // loading | approved | rejected | pending | error
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const finalizeCart = React.useCallback(() => {
    api.post('/cart/finalize', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .catch(() => alert('Erro ao finalizar pedido'));
  }, [token]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      setPaymentStatus('loading');

      const searchParams = new URLSearchParams(location.search);
      const paymentId = searchParams.get('payment_id');

      if (!paymentId) {
        setPaymentStatus('error');
        return;
      }

      try {
        const response = await api.get(`/payments/check?payment_id=${paymentId}`);
        const { status } = response.data;

        if (status === 'approved') {
          setPaymentStatus('approved')
          finalizeCart();
        } else if (status === 'pending') {
          setPaymentStatus('pending');
        } else if (status === 'in_process'){
          setPaymentStatus('pending')
        } else {
          setPaymentStatus('rejected');
        }
      } catch (err) {
        console.error("Erro ao verificar pagamento:", err);
        setPaymentStatus('error');
      }
    };

    checkPaymentStatus();
  }, [location, navigate, finalizeCart]);


  const handleGoToCart = () => {
    navigate('/cart');
  };

  const handleGoToHome = () => {
    navigate('/items');
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case 'loading':
        return (
          <div className="text-center py-5">
            <h4>Verificando pagamento...</h4>
            <p>Aguarde enquanto confirmamos seu pagamento.</p>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        );

      case 'approved':
        return (
          <div className="text-center py-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#28a745" className="mb-3" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.751.751 0 0 0-1.06 1.06L6.7 10.76l3.67-4.687a.5.5 0 0 0-.707-.707"/>
            </svg>
            <h4 className="text-success mb-3">Pagamento Aprovado!</h4>
            <p className="mb-4">Obrigado pela sua compra. Seu pedido foi processado com sucesso.</p>
            <button className="btn btn-primary me-2" onClick={handleGoToCart}>
              Ver meu carrinho
            </button>
            <button className="btn btn-outline-secondary" onClick={handleGoToHome}>
              Ir para Home
            </button>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center py-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ffc107" className="mb-3" viewBox="0 0 16 16">
              <path d="M2.5 15a.5.5 0 1 1 0-1H5v-3H2.5a.5.5 0 0 1 0-1H5V6H2.5a.5.5 0 0 1 0-1H5V1H2.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1H11v4h2.5a.5.5 0 0 1 0 1H11v3h2.5a.5.5 0 0 1 0 1H11v4h2.5a.5.5 0 0 1 0 1z"/>
            </svg>
            <h4 className="text-warning mb-3">Pagamento Pendente</h4>
            <p className="mb-4">Seu pagamento ainda está em análise. Você será notificado assim que for aprovado.</p>
            <button className="btn btn-primary me-2" onClick={handleGoToCart}>
              Voltar ao Carrinho
            </button>
            <button className="btn btn-outline-secondary" onClick={handleGoToHome}>
              Ir para Home
            </button>
          </div>
        );

      case 'rejected':
        return (
          <div className="text-center py-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#dc3545" className="mb-3" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
            </svg>
            <h4 className="text-danger mb-3">Pagamento Recusado</h4>
            <p className="mb-4">Infelizmente não foi possível processar seu pagamento. Tente novamente ou entre em contato conosco.</p>
            <button className="btn btn-primary me-2" onClick={handleGoToCart}>
              Tentar Novamente
            </button>
            <button className="btn btn-outline-secondary" onClick={handleGoToHome}>
              Ir para Home
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#6c757d" className="mb-3" viewBox="0 0 16 16">
              <path d="M7.938 2.016A.146.146 0 0 1 8 2c.25 0 .481.1.613.267l6.5 8.667A1.999 1.999 0 0 1 14.613 13H1.387a1.999 1.999 0 0 1-.359-1.733L7.938 2.016zM14.613 11.5L8 2.984 1.387 11.5a1.999 1.999 0 0 0 .359 1.733C1.907 13.432 2.287 13.6 2.687 13.6h10.626c.399 0 .779-.168.94-.414.162-.246.162-.5.162-.5s.002-.255-.158-.495zm-1.845 2.335a.5.5 0 0 1-.353-.353L12.32 11.5H3.68l-.175-.24a.5.5 0 0 1-.052-.313.5.5 0 0 1 .276-.417l7-3a.5.5 0 0 1 .353-.052.5.5 0 0 1 .313.052l7 3a.5.5 0 0 1 .052.313.5.5 0 0 1-.276.417l-.175.24z"/>
            </svg>
            <h4 className="text-muted mb-3">Erro na verificação</h4>
            <p className="mb-4">Não foi possível verificar o status do pagamento. Por favor, tente novamente mais tarde.</p>
            <button className="btn btn-primary me-2" onClick={handleGoToCart}>
              Voltar ao Carrinho
            </button>
            <button className="btn btn-outline-secondary" onClick={handleGoToHome}>
              Ir para Home
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm p-4 border-0 rounded">
            <div className="card-body text-center">
              <h3 className="card-title mb-4">Status do Pagamento</h3>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}