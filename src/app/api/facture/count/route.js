import { NextResponse } from "next/server";
import Facture from "@/app/models/Facture";
import dbConnect from "@/app/utils/dbConnect";

export async function GET(req) {
  try {
    await dbConnect();
    const count = await Facture.countDocuments();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting factures:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}