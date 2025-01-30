import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './index.css';
import './app.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/login", { email, password })
      .then((result) => {
        console.log("Login Successful:", result);
        setIsLoggedIn(true);
        navigate('/home');
      })
      .catch((err) => {
        console.error("Error logging in:", err);
        setErrorMessage("Invalid email or password.");
      });
  };

  const handleLogout = () => {
    axios
      .post("http://localhost:8000/api/logout") // Appel à l'API de déconnexion
      .then((response) => {
        console.log("Logout Successful:", response);
        setIsLoggedIn(false); // Mettre à jour l'état de connexion
        navigate('/login'); // Rediriger vers la page de connexion
      })
      .catch((err) => {
        console.error("Error logging out:", err);
      });
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-white-50 mb-5">Please enter your login and password!</p>
                  {errorMessage && (
                    <div className="alert alert-danger mb-3" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  {!isLoggedIn ? (
                    <form onSubmit={handleSubmit}>
                      <div className="form-outline form-white mb-4">
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          placeholder="Email"
                          required
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-outline form-white mb-4">
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="Password"
                          required
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <p className="small mb-5 pb-lg-2">
                        <Link to="/forgot-password" className="text-white-50">Forgot password?</Link>
                      </p>
                      <button type="submit" className="btn btn-outline-light btn-lg px-5">Login</button>
                    </form>
                  ) : (
                    // Display Logout button when logged in
                    <div>
                      <h3>Welcome, you are logged in!</h3>
                      <button onClick={handleLogout} className="btn btn-outline-light btn-lg px-5">
                        Logout
                      </button>
                    </div>
                  )}
                  <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <Link to="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></Link>
                    <Link to="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></Link>
                    <Link to="#!" className="text-white"><i className="fab fa-google fa-lg"></i></Link>
                  </div>
                </div>
                <div>
                  <p className="mb-0">Don't have an account? <Link to="/register" className="text-white-50 fw-bold">Sign Up</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;