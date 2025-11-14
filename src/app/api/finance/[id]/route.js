import dbConnect from "@/app/utils/dbConnect";
import Finance from "@/app/models/Finance";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const finance = await Finance.findById(id);
    return NextResponse.json(finance);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const finance = await Finance.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(finance);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const finance = await Finance.findByIdAndDelete(id);
    return NextResponse.json(finance);
  } catch (error) {
    return NextResponse.json(error);
  }
}