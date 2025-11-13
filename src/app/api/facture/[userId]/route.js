import dbConnect from "@/app/utils/dbConnect";
import Facture from "@/app/models/Facture";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { userId } = await params;
    const factures = await Facture.find({ client_id: userId });
    return NextResponse.json(factures);
  } catch (error) {
    return NextResponse.json(error);
  }
}
