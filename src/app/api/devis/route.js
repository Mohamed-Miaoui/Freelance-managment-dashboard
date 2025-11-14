import dbConnect from "@/app/utils/dbConnect";
import Devis from "@/app/models/Devis";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();
    const body = await req.json();
    const devis = await Devis.create(body);
    return NextResponse.json(devis);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(req, res) {
  try {
    await dbConnect();
    const devis = await Devis.find();
    return NextResponse.json(devis);
  } catch (error) {
    return NextResponse.json(error);
  }
}


