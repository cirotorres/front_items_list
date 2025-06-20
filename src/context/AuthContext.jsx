import { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem("token");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [userId, setUserId] = useState(() => {
    if (savedToken) {
      try {
        return jwtDecode(savedToken).user_id;
      } catch {
        return "";
      }
    }
    return "";
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    
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
  try {
    const decoded = jwtDecode(jwt);  
    localStorage.setItem("token", jwt);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("userId", decoded.user_id);
    setToken(jwt);
    setEmail(userEmail);
    setIsAdmin(decoded.user_adm === true);
    } catch (e) {

      logout();
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    setToken("");
    setEmail("");
    setUserId("");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ token, email, isAdmin, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
