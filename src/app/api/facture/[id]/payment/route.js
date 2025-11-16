import { NextResponse } from "next/server";
import Facture from "@/app/models/Facture";
import dbConnect from "@/app/utils/dbConnect";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const payment = await req.json();

    const facture = await Facture.findById(id);
    if (!facture) {
      return NextResponse.json(
        { error: "Facture not found" },
        { status: 404 }
      );
    }

    facture.paiements.push(payment);
    await facture.save(); // This will trigger the pre-save hook

    return NextResponse.json(facture);
  } catch (error) {
    console.error("Error adding payment:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}