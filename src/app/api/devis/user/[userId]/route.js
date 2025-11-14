import dbConnect from "@/app/utils/dbConnect";
import Devis from "@/app/models/Devis";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { userId } = await params;
    const all_Devis = await Devis.find({ client_id: userId });
    return NextResponse.json(all_Devis);
  } catch (error) {
    return NextResponse.json(error);
  }
}
