const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.DATABASE;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

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

const Parametres = mongoose.models.Parametres || mongoose.model('Parametres', ParametresSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        let settings = await Parametres.findOne();

        if (!settings) {
            console.log('No settings found. Creating default settings...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            settings = await Parametres.create({
                nom_complet: 'Miaoui Mohamed',
                password: hashedPassword
            });
            console.log('Settings created successfully with default password "admin123".');
        } else {
            console.log('Settings found.');
            if (!settings.password) {
                console.log('Password missing. Updating with default password "admin123"...');
                const hashedPassword = await bcrypt.hash('admin123', 10);
                settings.password = hashedPassword;
                await settings.save();
                console.log('Password updated successfully.');
            } else {
                console.log('Password already exists.');
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
