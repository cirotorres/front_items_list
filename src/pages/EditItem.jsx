import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function EditItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    api
      .get(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setName(res.data.name);
        setPrice(res.data.price);
        setDescription(res.data.description);
        setExistingImages(res.data.images || []);
      })
      .catch(() => {
        alert("Erro ao carregar item");
        navigate("/items");
      });
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("item[name]", name);
    formData.append("item[price]", price);
    formData.append("item[description]", description);
    formData.append("removed_image_ids", JSON.stringify(removedImageIds));

    images.forEach((img) => {
      formData.append("images[]", img);
    });

    try {
      await api.patch(`/items/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item atualizado com sucesso!");
      navigate("/items");
    } catch (err) {
      alert("Erro ao atualizar item");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const removeImage = (index, imageId = null) => {
    if (imageId) {
      const updated = [...existingImages];
      updated.splice(index, 1);
      setExistingImages(updated);
      setRemovedImageIds((prev) => [...prev, imageId]);
    } else {
      const newIndex = index - existingImages.length;
      const updatedImages = [...images];
      const updatedPreviews = [...previewUrls];
      updatedImages.splice(newIndex, 1);
      updatedPreviews.splice(newIndex, 1);
      setImages(updatedImages);
      setPreviewUrls(updatedPreviews);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow mx-auto" style={{ maxWidth: "700px" }}>
        <div className="card-body">
          <h2 className="mb-4">Editar Item</h2>
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
                className="form-control"
                placeholder="Descrição do produto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ height: "100px" }}
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

            <div className="mb-3 d-flex flex-wrap gap-3 justify-content-center">
              {existingImages.map((img, index) => (
                <div key={`existing-${img.id}`} className="position-relative">
                  <img
                    src={img.url}
                    alt={`Imagem existente ${index}`}
                    className="img-thumbnail"
                    style={{ maxHeight: "120px", maxWidth: "120px" }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    onClick={() => removeImage(index, img.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}

              {images.map((_, index) => (
                <div key={`new-${index}`} className="position-relative">
                  <img
                    src={previewUrls[index]}
                    alt={`Preview nova ${index}`}
                    className="img-thumbnail"
                    style={{ maxHeight: "120px", maxWidth: "120px" }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    onClick={() => removeImage(existingImages.length + index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Atualizar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
