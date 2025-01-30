const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Product = require('../models/product');
const Cart = require('../models/cart');

router.use(bodyParser.json());
const authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send({ message: 'Vous devez être connecté pour ajouter un produit au panier' });
    }
  
    try {
      const decoded = jwt.verify(token, 'secret');
      req.user = decoded;  // Ajouter l'utilisateur décodé dans la requête
      next();
    } catch (err) {
      return res.status(401).send({ message: 'Token invalide' });
    }
  };
  
  // Ajouter un produit au panier
  router.post('/cart/add-to-cart', async (req, res) => {
    try {
        // Vérifier que l'utilisateur est authentifié
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).send({ message: 'Vous devez être connecté pour ajouter un produit au panier' });
        }

        const decoded = jwt.verify(token, 'secret');
        const userId = decoded._id;

        // Récupérer l'utilisateur à partir de son ID
        const userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            // Si le panier n'existe pas encore, on en crée un nouveau
            const newCart = new Cart({
                user: userId,
                items: [{ product: req.body.productId, quantity: req.body.quantity }]
            });
            await newCart.save();
            return res.status(201).send({ message: 'Produit ajouté au panier', cart: newCart });
        } else {
            // Si le panier existe déjà, on l'update
            const existingItemIndex = userCart.items.findIndex(item => item.product.toString() === req.body.productId);

            if (existingItemIndex >= 0) {
                // Le produit existe déjà, on met à jour la quantité
                userCart.items[existingItemIndex].quantity += req.body.quantity;
            } else {
                // Le produit n'existe pas encore, on l'ajoute
                userCart.items.push({ product: req.body.productId, quantity: req.body.quantity });
            }

            await userCart.save();
            return res.status(200).send({ message: 'Produit ajouté au panier', cart: userCart });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Erreur serveur', error: err.message });
    }
});

  


router.post('/add-product', async (req, res) => {
    try {
        // Vérifier que l'utilisateur est authentifié (si nécessaire)
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).send({ message: 'Vous devez être connecté pour ajouter un produit' });
        }

        const decoded = jwt.verify(token, 'secret');
        const userId = decoded._id;

        // Créer un nouveau produit
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            user: userId
        });

        const savedProduct = await product.save();

        res.status(201).send({
            message: 'Produit ajouté avec succès',
            product: savedProduct
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Erreur serveur', error: err.message });
    }
});


router.get('/products', async (req, res) => {
    try {
        // Supprimer la vérification du token
        // const token = req.cookies.jwt; // Suppression de la vérification du token

        // Récupérer tous les produits sans condition d'authentification
        const products = await Product.find();

        res.status(200).send({
            message: 'Produits récupérés avec succès',
            products: products
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Erreur serveur', error: err.message });
    }
});
// Routes existantes
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        });
        
        const result = await user.save();
        const { password, ...data } = result.toJSON();
        res.status(201).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Erreur serveur', error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
        return res.status(404).send({
            message: 'user not found'
        });
    }
    
    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: 'invalid credentials'
        });
    }
    
    const token = jwt.sign({ _id: user._id }, "secret");
    
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    
    res.send({
        message: 'success'
    });
});

router.post('/logout', async (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.send({
        message: 'success'
    });
});


module.exports = router;