// src/pages/ManageAnnouncements.jsx
import React, { useState } from 'react';
import BannerTab from '../components/announcements/BannerTab';
import PopupTab from '../components/announcements/PopupTab';
import CouponTab from '../components/announcements/CouponTab';

export default function ManageAnnouncements() {
  const [activeTab, setActiveTab] = useState('banner');

  return (
    <div className="container py-4">
      <h2 className="mb-4">Gerenciar Anúncios</h2>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'banner' ? 'active' : ''}`} onClick={() => setActiveTab('banner')}>
            Banners
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'popup' ? 'active' : ''}`} onClick={() => setActiveTab('popup')}>
            Pop-ups
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'coupon' ? 'active' : ''}`} onClick={() => setActiveTab('coupon')}>
            Cupons
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'banner' && <BannerTab />}
        {activeTab === 'popup' && <PopupTab />}
        {activeTab === 'coupon' && <CouponTab />}
      </div>
    </div>
  );
}
