import dbConnect from "@/app/utils/dbConnect";
import Parametres from "@/app/models/Parametres";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const settings = await Parametres.getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req, res) {
  try {
    const settings = await Parametres.getSettings();
    const { nom_complet, matricule_fiscal, adresse, telephone, email, rib, conditions_generales, logo_path, tva_assujetti, taux_tva } = await req.json();
    await Parametres.findOneAndUpdate({ _id: settings._id }, { $set: { nom_complet, matricule_fiscal, adresse, telephone, email, rib, conditions_generales, logo_path, tva_assujetti, taux_tva } }, { new: true });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(error);
  }
}
