import express from 'express';
import Outfit from '../models/Outfit.js';

const router = express.Router();

// Get all outfits
router.get('/', async (req, res) => {
  const outfits = await Outfit.find().populate('items');
  res.json(outfits);
});

// Add a new outfit
router.post('/', async (req, res) => {
  const { name, items } = req.body;
  const newOutfit = new Outfit({ name, items });
  await newOutfit.save();
  const populatedOutfit = await Outfit.findById(newOutfit._id).populate('items');
  res.status(201).json(populatedOutfit);
});

// Update an outfit
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, items } = req.body;
  const updatedOutfit = await Outfit.findByIdAndUpdate(id, { name, items }, { new: true }).populate('items');
  res.json(updatedOutfit);
});

// Delete an outfit
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Outfit.findByIdAndDelete(id);
  res.status(204).end();
});

export default router;
