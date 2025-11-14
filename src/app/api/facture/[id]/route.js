import dbConnect from "@/app/utils/dbConnect";
import Facture from "@/app/models/Facture";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
      await dbConnect();
      const { id } = await params;
      const facture = await Facture.findById(id);
      return NextResponse.json(facture);
    } catch (error) {
      return NextResponse.json(error);
    }
  }
  
  export async function PUT(req, { params }) {
    try {
      await dbConnect();
      const { id } = await params;
      const body = await req.json();
      const facture = await Facture.findByIdAndUpdate(id, body, {
        new: true,
      });
      return NextResponse.json(facture);
    } catch (error) {
      return NextResponse.json(error);
    }
  }
  
  export async function DELETE(req, { params }) {
    try {
      await dbConnect();
      const { id } = await params;
      const facture = await Facture.findByIdAndDelete(id);
      return NextResponse.json(facture);
    } catch (error) {
      return NextResponse.json(error);
    }
  } 