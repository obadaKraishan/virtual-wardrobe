import mongoose from 'mongoose';

const outfitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});

export default mongoose.model('Outfit', outfitSchema);
