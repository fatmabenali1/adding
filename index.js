const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Importez cors
require('dotenv').config(); // Ajout de la configuration dotenv

mongoose.connect('mongodb://localhost:27017/test')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
  const routes = require('./routes/routes');

const app = express();

app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
    credentials: true,  
  }));

app.use(express.json());

app.use('/api', routes);

// Démarrage du serveur

app.listen(8000)