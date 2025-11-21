import mongoose from 'mongoose';

const LigneSchema = new mongoose.Schema({
  description: { type: String, required: true },
  // quantite: { type: Number, required: true },
  // prix_unitaire: { type: Number, required: true },
  montant: { type: Number, required: true }
}, { _id: false });

const DevisSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  numero: { type: String, required: true, unique: true },
  date_emission: { type: Date, required: true },
  date_validite: { type: Date, required: true },
  statut: { type: String, enum: ['en_attente', 'accepte', 'refuse', 'expire'], default: 'en_attente' },
  montant_ht: { type: Number, required: true },
  tva: { type: Number, default: 0 },
  timbre_fiscal: { type: Number, default: 0 },
  montant_ttc: { type: Number, required: true },
  montant_acompte: { type: Number, default: 0 },
  conditions_paiement: { type: String },
  notes: { type: String },
  type_prestation: {
  type: String,
  enum: [
    'projet',          // Website build, web application, any one-time big project
    'maintenance',     // Monthly or yearly maintenance
    'hebergement',     // Hosting fee
    'ajout_fonction',  // Adding new features after project delivery
    'abonnement'       // Any recurring fee (SEO, support package, etc.)
  ],
  required: true,
  default: 'projet'
},

  lignes: [LigneSchema],
  created_at: { type: Date, default: Date.now }
});

DevisSchema.index({ numero: 1, statut: 1 });

export default mongoose.models.Devis || mongoose.model('Devis', DevisSchema);