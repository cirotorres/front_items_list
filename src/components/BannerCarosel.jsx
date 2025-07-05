import React, { useEffect, useState } from "react";
// import img1 from "../assets/BannerPics/img1.png";
// import img2 from "../assets/BannerPics/img2.png";
// import img3 from "../assets/BannerPics/img3.png";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";



export default function BannerCarosel() {
    const [banners, setBanners] = useState([]);
    const { token } = useAuth();


    const loadBanners = React.useCallback(() => {
        api.get('/announcements', { headers: { Authorization: `Bearer ${token}` }, params: { type: 'banner' } })
        .then(res => setBanners(res.data))
        .catch(err => console.error('Erro ao carregar favoritos', err));
    }, [token]);





    useEffect(() => loadBanners(),[token, loadBanners] )

    return (
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
            {/* Indicadores na base do banner  */}
            <div className="carousel-indicators">
            {banners.map((_, index) => (
                <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : undefined}
                aria-label={`Slide ${index + 1}`}
                />
            ))}
            </div>

            {/* imagens do banner */}
            <div className="carousel-inner">

                {banners.map( (banner, index) => (
                    <>
                    <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={banner.id}>
                        <img 
                            src={banner.images[0]}
                            className="d-block w-100 banner-img"
                            alt={banner.title}
                        />
                    </div>   
                    
                    </>
                ) )}
            </div>
            
            {/* botões do banner */}
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );

};