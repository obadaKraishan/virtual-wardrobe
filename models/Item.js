import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  image: { type: String, required: true } // URL to the image of the item
});

export default mongoose.model('Item', itemSchema);
