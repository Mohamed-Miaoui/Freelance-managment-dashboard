import mongoose from 'mongoose';

const ParametresSchema = new mongoose.Schema({
  nom_complet: { type: String },
  matricule_fiscal: { type: String },
  adresse: { type: String },
  telephone: { type: String },
  email: { type: String },
  rib: { type: String },
  conditions_generales: { type: String },
  logo_path: { type: String },
  tva_assujetti: { type: Boolean, default: false },
  taux_tva: { type: Number, default: 19 },
  password: { type: String },
  updated_at: { type: Date, default: Date.now }
});

ParametresSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({ nom_complet: 'Miaoui Mohamed' });
  }
  return settings;
};

export default mongoose.models.Parametres || mongoose.model('Parametres', ParametresSchema);