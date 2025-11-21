import mongoose from 'mongoose';

const LigneSchema = new mongoose.Schema({
  description: { type: String, required: true },
  // quantite: { type: Number, required: true },
  // prix_unitaire: { type: Number, required: true },
  montant: { type: Number, required: true }
}, { _id: false });

const PaiementSchema = new mongoose.Schema({
  montant: { type: Number, required: true },
  date_paiement: { type: Date, required: true },
  mode_paiement: { type: String, enum: ['virement', 'cheque', 'especes', 'autre'] },
  reference: { type: String },
  notes: { type: String }
}, { _id: true });

const FactureSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  devis_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Devis' },
  numero: { type: String, required: true, unique: true },
  date_emission: { type: Date, required: true },
  date_echeance: { type: Date, required: true },
  statut: { type: String, enum: ['en_attente', 'payee', 'en_retard'], default: 'en_attente' },
  montant_ht: { type: Number, required: true },
  tva: { type: Number, default: 0 },
  timbre_fiscal: { type: Number, default: 0 },
  montant_ttc: { type: Number, required: true },
  acompte: { type: Number, default: 0 },
  solde_a_payer: { type: Number },
  conditions_paiement: { type: String },
  notes: { type: String },
  lignes: [LigneSchema],
  paiements: [PaiementSchema],
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
  created_at: { type: Date, default: Date.now }
});

FactureSchema.index({ numero: 1, statut: 1 });

// Auto-calcul du solde
FactureSchema.pre('save', function(next) {
  const totalPaiements = this.paiements.reduce((sum, p) => sum + p.montant, 0);
  this.solde_a_payer = this.montant_ttc - totalPaiements - this.acompte;
  if (this.solde_a_payer <= 0) this.statut = 'payee';
  next();
});

export default mongoose.models.Facture || mongoose.model('Facture', FactureSchema);