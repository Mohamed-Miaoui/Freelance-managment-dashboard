import dbConnect from "@/app/utils/dbConnect";
import Finance from "@/app/models/Finance";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();
    const body = await req.json();
    const finance = await Finance.create(body);
    return NextResponse.json(finance);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(req, res) {
  try {
    await dbConnect();
    const finances = await Finance.find();
    return NextResponse.json(finances);
  } catch (error) {
    return NextResponse.json(error);
  }
}

