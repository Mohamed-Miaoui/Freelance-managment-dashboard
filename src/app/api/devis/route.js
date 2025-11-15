import dbConnect from "@/app/utils/dbConnect";
import Devis from "@/app/models/Devis";
import { NextResponse } from "next/server";

// Generate numero automatically
const generateDevisNumero = async () => {
  const year = new Date().getFullYear();
  const count = await Devis.countDocuments({
    numero: new RegExp(`^Devis-${year}-`)
  });
  return `Devis-${year}-${String(count + 1).padStart(3, '0')}`;
};

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Auto-generate numero if not provided
    if (!body.numero) {
      body.numero = await generateDevisNumero();
    }

    const devisData = {
      ...body,
      date_emission: new Date(body.date_emission),
      date_validite: new Date(body.date_validite),
    };

    const devis = await Devis.create(devisData);
    console.log("Devis created successfully:", devis);
    
    return NextResponse.json(devis, { status: 201 });
  } catch (error) {
    console.error("Error creating devis:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const devis = await Devis.find()
      .populate('client_id', 'nom email') // Populate client info
      .sort({ created_at: -1 }); // Sort by newest first
    
    return NextResponse.json(devis);
  } catch (error) {
    console.error("Error fetching devis:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


