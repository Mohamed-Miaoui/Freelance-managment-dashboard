import dbConnect from "@/app/utils/dbConnect";
import Devis from "@/app/models/Devis";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();
    const devis = await Devis.create(req.body);
    return NextResponse.json(devis);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(req, res) {
  try {
    const devis = await Devis.find();
    return NextResponse.json(devis);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req, res) {
  try {
    const devis = await Devis.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return NextResponse.json(devis);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function DELETE(req, res) {
  try {
    const devis = await Devis.findByIdAndDelete(req.params.id);
    return NextResponse.json(devis);
  } catch (error) {
    return NextResponse.json(error);
  }
}