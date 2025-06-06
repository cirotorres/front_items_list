import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NewItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("item[name]", name);
    formData.append("item[price]", price);
    formData.append("item[description]", description);
      images.forEach((img) => {
        formData.append("images[]", img);
      });

    try {
      await api.post(
        "/items",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Item criado com sucesso!");
      navigate("/items");
    } catch (err) {
      alert("Erro ao criar item");
    }
  };

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  setImages(files);

  const previews = files.map((file) => URL.createObjectURL(file));
  setPreviewUrls(previews);
};

  const removeImage = (index) => {
  const updatedImages = [...images];
  const updatedPreviews = [...previewUrls];
  updatedImages.splice(index, 1);
  updatedPreviews.splice(index, 1);
  setImages(updatedImages);
  setPreviewUrls(updatedPreviews);
};

  return (
    <div className="container my-5">
      <div className="card shadow mx-auto" style={{maxWidth:"700px"}}>
        <div className="card-body">
          <h2 className="mb-4">Novo Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nome do item"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Preço"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <textarea
                type="text"
                className="form-control"
                placeholder="Descrição do produto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{height: "100px"}}
              />
            </div>

            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
                accept="image/*"
                multiple
              />
            </div>

            {previewUrls.length > 0 && (
              <div className="mb-3 d-flex flex-wrap gap-3 justify-content-center">
                {previewUrls.map((url, index) => (
                  <div key={index} className="position-relative">
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      className="img-thumbnail"
                      style={{ maxHeight: "120px", maxWidth: "120px" }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                      onClick={() => removeImage(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
