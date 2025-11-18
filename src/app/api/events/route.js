import { NextResponse } from "next/server";
import Event from "@/app/models/Event";
import dbConnect from "@/app/utils/dbConnect";;

export async function GET(req) {
  try {
    await dbConnect();
    const events = await Event.find()
      .populate('client_id', 'nom')
      .populate('project_id', 'nom')
      .sort({ date: 1 });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const event = await Event.create(body);
    
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}