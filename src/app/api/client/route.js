import dbConnect from "@/app/utils/dbConnect";
import Client from "@/app/models/Client";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();
    const client = await Client.create(req.body);
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(req, res) {
  try {
    const clients = await Client.find();
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req, res) {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function DELETE(req, res) {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(error);
  }
}