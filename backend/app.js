const express = require('express');

const mongoose = require('mongoose');

const path = require('path');

const app = express();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user')

// ---------------------- connexion bd mongodb ------------------------------------------------------------

mongoose.connect('mongodb+srv://malik_P6:lD9GTlG0lUFM4oim@cluster0.3ekezu3.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// ----------------------------- CORS -------------------------------------------------------------------

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;