import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String },
  telephone: { type: String },
  adresse: { type: String },
  matricule_fiscal: { type: String },
  notes : { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);