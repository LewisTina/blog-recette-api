const express = require('express');
const router = express.Router();
const membreController = require('../controllers/membresController');

router.get('/', membreController.getMembres);
router.get('/:id', membreController.getMembreById);
router.post('/login', membreController.getMembreByEmailAndPassword);
router.post('/register', membreController.createMembre);
router.put('/:id', membreController.updateMembre);
router.delete('/:id', membreController.deleteMembre);

module.exports = router;
