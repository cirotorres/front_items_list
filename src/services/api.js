import axios from 'axios';

const api = axios.create({
    // baseURL: "http://localhost:3000", // Development
     baseURL: process.env.REACT_APP_API_URL,
    // baseURL: "https://item-list-7c2g.onrender.com", // Production
});

export default api;