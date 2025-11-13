import dbConnect from "@/app/utils/dbConnect";
import Finance from "@/app/models/Finance";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();
    const finance = await Finance.create(req.body);
    return NextResponse.json(finance);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(req, res) {
  try {
    const finances = await Finance.find();
    return NextResponse.json(finances);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req, res) {
  try {
    const finance = await Finance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return NextResponse.json(finance);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function DELETE(req, res) {
  try {
    const finance = await Finance.findByIdAndDelete(req.params.id);
    return NextResponse.json(finance);
  } catch (error) {
    return NextResponse.json(error);
  }
}