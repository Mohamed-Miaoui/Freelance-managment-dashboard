import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String, required: true },
  adresse: { type: String },
  matricule_fiscal: { type: String },
  notes : { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);