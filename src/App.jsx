import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Items from "./pages/items";
import Register from "./pages/register";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import PrivateRoute from "./services/PrivateRoute";
import NewItem from "./pages/NewItem";
import EditItem from "./pages/EditItem";
import ShowItem from "./pages/ShowItem";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" 
            element={<Login />} />

          <Route path="/register" 
            element= {<Register/>} />          

          <Route path="/items" 
            element={
            <PrivateRoute>
              <Items />
            </PrivateRoute>
          }/>

          <Route path="/items/new" 
            element={
              <PrivateRoute adminOnly>
                <NewItem />
              </PrivateRoute>
            }/>

          <Route path="/items/:id/edit"
            element={
              <PrivateRoute adminOnly>
                <EditItem />
              </PrivateRoute>
          }/>

          <Route path="/items/:id"
            element={
              <PrivateRoute>
                <ShowItem />
              </PrivateRoute>
          }/>          

        </Routes>
       
      </BrowserRouter>
       <Footer />
    </AuthProvider>
  );
}

export default App;

