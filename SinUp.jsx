import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './index.css';
import './app.css';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/register", { name, email, password })
      .then((result) => {
        console.log("Registration Successful:", result);
        navigate('/login'); // Navigate to login page upon successful registration
      })
      .catch((err) => {
        console.error("Error registering:", err);
        setErrorMessage("There was an error registering your account.");
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
                  <h2 className="fw-bold mb-2 text-uppercase">Sign Up</h2>
                  <p className="text-white-50 mb-5">Please enter your details to sign up!</p>
                  {errorMessage && (
                    <div className="alert alert-danger mb-3" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Name"
                        required
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
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
                    <button type="submit" className="btn btn-outline-light btn-lg px-5">Sign Up</button>
                  </form>
                  <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <Link to="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></Link>
                    <Link to="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></Link>
                    <Link to="#!" className="text-white"><i className="fab fa-google fa-lg"></i></Link>
                  </div>
                </div>
                <div>
                  <p className="mb-0">Already have an account? <Link to="/login" className="text-white-50 fw-bold">Login</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;