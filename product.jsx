import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les produits
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products');
      console.log('Réponse de l\'API:', response.data); // Vérifie la structure de la réponse
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (err) {
      setError('Erreur de chargement des produits');
      setLoading(false);
    }
  };

  // Appel de la fonction au montage du composant
  useEffect(() => {
    fetchProducts();
  }, []);

  // Affichage pendant le chargement ou en cas d'erreur
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Liste des Produits</h1>
      <div className="row">
        {Array.isArray(products) && products.length > 0 ? (
          products.map(product => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card">
                {/* Affichage de l'image si elle existe */}
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text"><strong>Prix : {product.price}€</strong></p>
                  <button className="btn btn-primary w-100">Ajouter au panier</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun produit trouvé</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
