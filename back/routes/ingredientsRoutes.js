// routes/ingredientRoutes.js
const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/ingredientsController');

router.get('/', ingredientsController.getIngredients);
router.get('/:id', ingredientsController.getIngredientById);
router.post('/', ingredientsController.createIngredient);
router.put('/:id', ingredientsController.updateIngredient);
router.delete('/:id', ingredientsController.deleteIngredient);

module.exports = router;
