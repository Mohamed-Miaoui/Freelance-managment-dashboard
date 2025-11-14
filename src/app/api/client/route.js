import dbConnect from "@/app/utils/dbConnect";
import Client from "@/app/models/Client";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();

    const body = await req.json();
    const client = await Client.create(body);
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



