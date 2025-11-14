import dbConnect from "@/app/utils/dbConnect";
import Facture from "@/app/models/Facture";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();
    const body = await req.json();
    const facture = await Facture.create(body);
    return NextResponse.json(facture);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(req, res) {
  try {
    await dbConnect();
    const factures = await Facture.find();
    return NextResponse.json(factures);
  } catch (error) {
    return NextResponse.json(error);
  }
}


