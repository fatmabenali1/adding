import React, { useState, useEffect } from 'react';
import { ShoppingBag, Gift, TruckIcon, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import axios from 'axios';

const Navbar = () => {
  const [cartItems, setCartItems] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]); // Etat pour stocker les produits
  const navigate = useNavigate();

  // Récupération des produits depuis le backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products'); // Assure-toi que l'URL de ton API est correcte
      setProducts(response.data.products); // Met à jour l'état avec les produits récupérés
    } catch (error) {
      console.error('Erreur lors de la récupération des produits', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Récupère les produits lorsque le composant est monté
  }, []); // [] assure que cela ne se lance qu'une seule fois

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      localStorage.removeItem('jwt');
      sessionStorage.removeItem('jwt');
      setIsLoggedIn(false);
      navigate('/home');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  // Ajouter un produit au panier
  const handleAddToCart = async (productId, quantity) => {
    try {
      const response = await axios.post('/api/cart/add-to-cart', { productId, quantity }, { withCredentials: true });
      if (response.status === 200) {
        // Mise à jour du nombre d'articles dans le panier
        setCartItems(response.data.cart.items.length);  // Ajuster le nombre total d'articles
        alert(response.data.message);  // Affiche un message de succès
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier', error);
      alert('Une erreur est survenue lors de l\'ajout au panier');
    }
  };

  const scrollToFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNavbar = () => {
    navbarRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sticky-top">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <span className="font-serif text-2xl font-bold tracking-wider text-amber-500 drop-shadow-md hover:text-amber-600 transition-colors duration-300">
              Shop Ben Yedder
            </span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={scrollToNavbar}>Accueil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={scrollToServices}>À propos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/maps">Notre Localisation</a>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={scrollToFooter}>Contact</button>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <div onClick={handleCartClick} className="position-relative me-3">
                <ShoppingCart size={24} className="text-white" />
                {cartItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItems}
                  </span>
                )}
              </div>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="btn btn-warning"
                >
                  Se Déconnecter
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="btn btn-warning"
                >
                  Se Connecter
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Section Avantages */}
      <div className="bg-light py-4">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center">
                <ShoppingBag className="text-amber-500 me-2" size={24} />
                <span className="text-muted">Livraison gratuite dès 50€</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center">
                <Gift className="text-amber-500 me-2" size={24} />
                <span className="text-muted">Cadeaux fidélité</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-center">
                <TruckIcon className="text-amber-500 me-2" size={24} />
                <span className="text-muted">Retours sous 30 jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Panier */}
      {showCart && (
        <div className="position-absolute end-0 mt-2 me-4 w-25 bg-white rounded shadow-lg p-3">
          <h2 className="h5 mb-3">Produits disponibles</h2>
          <div className="list-group">
            {products.length === 0 ? (
              <p>Aucun produit disponible.</p>
            ) : (
              products.map((product) => (
                <div key={product._id} className="list-group-item">
                  <div className="d-flex align-items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-thumbnail me-3"
                      style={{ width: '64px', height: '64px' }}
                    />
                    <div>
                      <h3 className="h6 mb-1">{product.name}</h3>
                      <p className="text-muted small mb-1">{product.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">{product.price} €</span>
                        <button
                          onClick={() => handleAddToCart(product._id, 1)} // Ajout du produit au panier
                          className="btn btn-sm btn-warning"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button onClick={() => setShowCart(false)} className="btn btn-secondary w-100 mt-3">Fermer</button>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "T-shirt Blanc",
      price: 29.99,
      image: "/api/placeholder/200/200",
      description: "T-shirt classique en coton"
    },
    {
      id: 2,
      name: "Jean Slim",
      price: 59.99,
      image: "/api/placeholder/200/200",
      description: "Jean slim fit bleu"
    },
    {
      id: 3,
      name: "Sneakers",
      price: 89.99,
      image: "/api/placeholder/200/200",
      description: "Sneakers confortables"
    }
  ];

  // Fonction pour envoyer le produit au backend
  const addProductToBackend = async (product) => {
    try {
      const response = await axios.post('http://localhost:8000/api/add-product', product, {
        withCredentials: true  // Permet d'envoyer des cookies (si nécessaire pour l'authentification)
      });

      if (response.status === 200) {
        alert('Produit ajouté avec succès!');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      alert('Erreur lors de l\'ajout du produit');
    }
  };

  return (
    <div>
      <header className="header-gradient text-center py-40 relative overflow-hidden w-full">
        <div className="header-content container mx-auto px-8 max-w-full">
          <h1 className="header-title text-4xl font-bold text-white mb-4">
            Bienvenue sur Shop Ben Yedder
          </h1>
          <p className="header-subtitle text-lg text-white opacity-80 mb-6">
            Découvrez une expérience shopping unique avec des produits soigneusement sélectionnés
          </p>

          <div className="features flex justify-center space-x-8 mb-8">
            <div className="feature flex flex-col items-center">
              <ShoppingBag className="feature-icon text-white" size={40} />
              <span className="feature-text text-white">Qualité Premium</span>
            </div>
            <div className="feature flex flex-col items-center">
              <Gift className="feature-icon text-white" size={40} />
              <span className="feature-text text-white">Offres Spéciales</span>
            </div>
            <div className="feature flex flex-col items-center">
              <TruckIcon className="feature-icon text-white" size={40} />
              <span className="feature-text text-white">Livraison Rapide</span>
            </div>
          </div>

          <div className="actions space-x-4">
            <button 
              className="btn-primary px-6 py-3 rounded-lg text-white"
              onClick={() => navigate('/products')}
              aria-label="Commencer mes achats"
            >
              Commencer mes achats
            </button>
            <button className="btn-secondary px-6 py-3 rounded-lg border-2 border-white text-white" aria-label="Découvrir nos collections">
              Découvrir nos collections
            </button>
          </div>
        </div>
      </header>

      {/* Section Produits */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center display-5 fw-bold mb-5">
            Nos Produits
          </h2>
          <div className="row g-4">
            {products.map((product) => (
              <div key={product.id} className="col-md-4">
                <div className="card h-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h3 className="card-title h5 fw-bold">{product.name}</h3>
                    <p className="card-text text-muted">{product.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="h5 fw-bold text-warning mb-0">{product.price} €</span>
                      <button 
                        className="btn btn-warning"
                        onClick={() => addProductToBackend(product)}  // Appel à la fonction pour ajouter le produit
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};


const Footer = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact Form Submitted:', contactForm);
    alert('Merci de votre message! Nous vous répondrons bientôt.');
  };

  return (
    <footer id="footer" className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          {/* Form Section */}
          <div className="col-md-4 mb-4">
            <div className="card bg-secondary text-light shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Contactez-nous</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nom</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleChange}
                      required
                      className="form-control bg-dark text-light"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleChange}
                      required
                      className="form-control bg-dark text-light"
                      placeholder="Votre email"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Sujet</label>
                    <textarea
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleChange}
                      required
                      className="form-control bg-dark text-light"
                      placeholder="Votre message"
                      rows="3"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-warning w-100">Envoyer</button>
                </form>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="col-md-4 mb-4">
            <div className="card bg-secondary text-light shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Nos services</h3>
                <ul className="list-unstyled">
                  <li>Support client 24/7</li>
                  <li>Livraison rapide</li>
                  <li>Garantie satisfait ou remboursé</li>
                  <li>Offres exclusives</li>
                </ul>
                <div className="text-center mt-4">
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                    <i className="fab fa-facebook-f fa-2x"></i>
                  </a>
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-light">
                    <i className="fab fa-instagram fa-2x"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="col-md-4 mb-4">
            <div className="card bg-secondary text-light shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Informations</h3>
                <ul className="list-unstyled">
                  <li>À propos de nous</li>
                  <li>Carrières</li>
                  <li>Blog</li>
                  <li>Presse</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};




// Home Page Component
const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section>
        <h2 className="about-us-title mb-6 text-center">À Propos de Nous</h2>
        <div className="card custom-card mb-4">
          <div className="card-body text-center">
            <p className="custom-text mb-4">
              Notre entreprise est dédiée à fournir les meilleurs produits
              et services à nos clients. Nous croyons en l'innovation,
              la qualité et la satisfaction client.
            </p>
            <p className="custom-text mb-4">
              Fondée en 2010, notre mission est de vous offrir une expérience
              unique à travers des produits haut de gamme, conçus pour
              améliorer votre quotidien et refléter votre style.
            </p>
            <p className="custom-text mb-4">
              Nous nous engageons à travailler avec des fournisseurs éthiques
              et à offrir un service client irréprochable.
            </p>
          </div>
        </div>

        <h3 className="about-us-subtitle text-center mb-4">Notre Équipe</h3>
        <div className="text-center">
          <p className="custom-text mb-4">
            Notre équipe passionnée travaille sans relâche pour vous offrir
            des produits de la plus haute qualité et un service personnalisé
            qui répond à vos attentes.
          </p>
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card custom-team-card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Jean Dupont</h5>
                  <p className="card-text">Directeur Général</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card custom-team-card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Marie Curie</h5>
                  <p className="card-text">Responsable Marketing</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card custom-team-card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Pierre Martin</h5>
                  <p className="card-text">Chef de Produit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const AddProductForm = () => {
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Envoi du produit au backend
      const response = await axios.post('http://localhost:8000/api/add-product', product, {
        withCredentials: true // Si nécessaire pour l'authentification
      });

      if (response.status === 201) {
        alert('Produit ajouté avec succès!');
        navigate('/products'); // Redirige vers la page des produits après ajout
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit', error);
      alert('Erreur lors de l\'ajout du produit');
    }
  };

  return (
    <div className="container">
      <h2>Ajouter un produit</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom du produit</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={product.name} 
            onChange={handleChange} 
            required 
            className="form-control" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            name="description" 
            value={product.description} 
            onChange={handleChange} 
            required 
            className="form-control"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="price">Prix</label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            value={product.price} 
            onChange={handleChange} 
            required 
            className="form-control" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input 
            type="text" 
            id="image" 
            name="image" 
            value={product.image} 
            onChange={handleChange} 
            className="form-control" 
          />
        </div>

        <button type="submit" className="btn btn-primary mt-4">Ajouter le produit</button>
      </form>
    </div>
  );
};


// Main App Component
const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Header />
      <main className="flex-grow">
        <AboutUs />
      </main>
      <AddProductForm />
      <Footer />
    </div>
  );
};

export default App;
