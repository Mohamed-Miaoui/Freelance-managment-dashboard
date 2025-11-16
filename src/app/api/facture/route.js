import Facture from "@/app/models/Facture";
import dbConnect from "@/app/utils/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    
    // Check if querying by devis_id
    const { searchParams } = new URL(req.url);
    const devis_id = searchParams.get('devis_id');
    
    const query = devis_id ? { devis_id } : {};
    
    const factures = await Facture.find(query)
      .populate('client_id', 'nom email telephone adresse matricule_fiscal')
      .populate('devis_id', 'numero')
      .sort({ created_at: -1 });
    
    return NextResponse.json(factures);
  } catch (error) {
    console.error("Error fetching factures:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log("Received body:", body);

    // Auto-generate numero if not provided
    if (!body.numero) {
      const year = new Date().getFullYear();
      const count = await Facture.countDocuments({
        numero: new RegExp(`^FAC-${year}-`)
      });
      body.numero = `FAC-${year}-${String(count + 1).padStart(3, '0')}`;
    }

    const factureData = {
      ...body,
      date_emission: new Date(body.date_emission),
      date_echeance: new Date(body.date_echeance),
    };

    const facture = await Facture.create(factureData);
    console.log("Facture created successfully");
    
    return NextResponse.json(facture, { status: 201 });
  } catch (error) {
    console.error("Error creating facture:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}