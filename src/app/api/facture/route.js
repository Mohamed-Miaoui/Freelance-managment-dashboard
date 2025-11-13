import dbConnect from "@/app/utils/dbConnect";
import Facture from "@/app/models/Facture";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();
    const facture = await Facture.create(req.body);
    return NextResponse.json(facture);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(req, res) {
  try {
    const factures = await Facture.find();
    return NextResponse.json(factures);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req, res) {
  try {
    const facture = await Facture.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return NextResponse.json(facture);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function DELETE(req, res) {
  try {
    const facture = await Facture.findByIdAndDelete(req.params.id);
    return NextResponse.json(facture);
  } catch (error) {
    return NextResponse.json(error);
  }
}