import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  statut: { type: String, enum: ['a_faire', 'en_cours', 'termine'], default: 'a_faire' },
  date_echeance: { type: Date }
}, { _id: true });

const ProjectSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  nom: { type: String, required: true },
  description: { type: String },
  statut: { type: String, enum: ['devis', 'en_cours', 'termine', 'annule'], default: 'devis' },
  type: { type: String, enum: ['site_web', 'app_mobile', 'ecommerce', 'autre'], default: 'site_web' },
  date_debut: { type: Date },
  date_fin_prevue: { type: Date },
  budget: { type: Number },
  pourcentage_completion: { type: Number, default: 0, min: 0, max: 100 },
  taches: [TaskSchema],
  devis_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Devis' },
  notes: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

ProjectSchema.index({ client_id: 1, statut: 1 });

// Auto-calcul du pourcentage
ProjectSchema.pre('save', function(next) {
  this.updated_at = new Date();
  if (this.taches.length > 0) {
    const termine = this.taches.filter(t => t.statut === 'termine').length;
    this.pourcentage_completion = Math.round((termine / this.taches.length) * 100);
  }
  next();
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);