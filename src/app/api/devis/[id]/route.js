import dbConnect from "@/app/utils/dbConnect";
import Devis from "@/app/models/Devis";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const devis = await Devis.findById(id);
    return NextResponse.json(devis);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const devis = await Devis.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return NextResponse.json(devis);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const devis = await Devis.findByIdAndDelete(id);
    return NextResponse.json(devis);
  } catch (error) {
    return NextResponse.json(error);
  }
}