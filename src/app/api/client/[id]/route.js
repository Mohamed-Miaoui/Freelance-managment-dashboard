import dbConnect from "@/app/utils/dbConnect";
import Client from "@/app/models/Client";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const client = await Client.findById(id);
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const client = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const client = await Client.findByIdAndDelete(id);
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(error);
  }
}