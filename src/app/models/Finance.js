import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['revenu', 'depense'], required: true },
  categorie: { 
    type: String, 
    enum: [
      'facturation', 'autre_revenu',
      'salaire', 'loyer', 'electricite', 'internet', 'materiel', 
      'logiciels', 'formation', 'transport', 'taxes', 'autre_depense'
    ], 
    required: true 
  },
  montant: { type: Number, required: true },
  description: { type: String, required: true },
  date_transaction: { type: Date, required: true },
  facture_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Facture' },
  mode_paiement: { type: String, enum: ['virement', 'cheque', 'especes', 'carte'] },
  notes: { type: String },
  created_at: { type: Date, default: Date.now }
});

TransactionSchema.index({ type: 1, date_transaction: -1 });

// Statistiques
TransactionSchema.statics.getStats = async function(dateDebut, dateFin) {
  const stats = await this.aggregate([
    { $match: { date_transaction: { $gte: dateDebut, $lte: dateFin } } },
    { $group: { _id: '$type', total: { $sum: '$montant' } } }
  ]);
  
  const revenus = stats.find(s => s._id === 'revenu')?.total || 0;
  const depenses = stats.find(s => s._id === 'depense')?.total || 0;
  
  return { revenus, depenses, benefice: revenus - depenses };
};

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);