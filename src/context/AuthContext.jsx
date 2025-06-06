import { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [isAdmin, setIsAdmin] = useState(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        return decoded.user_adm === true;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const login = (jwt, userEmail) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("email", userEmail);
    setToken(jwt);
    setEmail(userEmail);

    try {
      const decoded = jwtDecode(jwt);
      setIsAdmin(decoded.user_adm === true);
    } catch (e) {
      setIsAdmin(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken("");
    setEmail("");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ token, email, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
