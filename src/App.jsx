// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./services/PrivateRoute";

import Login from "./pages/login";
import Register from "./pages/register";
import Items from "./pages/items";
import NewItem from "./pages/NewItem";
import EditItem from "./pages/EditItem";
import ShowItem from "./pages/ShowItem";
import Cart from "./pages/Cart";
import Favorite from "./pages/Favorite";
import EditUser from "./pages/EditUser";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./App.css";
import ConfigPage from "./pages/ConfigPage";
import ManageAnnouncements from "./pages/ManageAnnouncements";
import PaymentStatus from "./pages/PaymentStatus";

function AppWrapper() {
  const location = useLocation();
  const hideLayout = ["/"].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pagamento/status" element={<PaymentStatus />} />
        <Route
          path="/items"
          element={
            <PrivateRoute>
              <Items />
            </PrivateRoute>
          }
        />
        <Route
          path="/items/new"
          element={
            <PrivateRoute adminOnly>
              <NewItem />
            </PrivateRoute>
          }
        />
        <Route
          path="/items/:id/edit"
          element={
            <PrivateRoute adminOnly>
              <EditItem />
            </PrivateRoute>
          }
        />
        <Route
          path="/items/:id"
          element={
            <PrivateRoute>
              <ShowItem />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/favorite"
          element={
            <PrivateRoute>
              <Favorite />
            </PrivateRoute>
          }
        />
        <Route
          path="/config"
          element={
            <PrivateRoute>
              <ConfigPage />
            </PrivateRoute>
          }
        />
      <Route
        path="/edit"
        element={
          <PrivateRoute>
            <EditUser/>
          </PrivateRoute>
        }
      />
      <Route
        path="/config/announcements"
        element={
          <PrivateRoute adminOnly>
            <ManageAnnouncements />
          </PrivateRoute>
        }
      />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
