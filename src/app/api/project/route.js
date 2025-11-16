import dbConnect from "@/app/utils/dbConnect";
import Project from "@/app/models/Project";
import { NextResponse } from "next/server";



export async function GET(req) {
  try {
    await dbConnect();
    const projects = await Project.find()
      .populate('client_id', 'nom email')
      .populate('devis_id', 'numero')
      .sort({ created_at: -1 });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
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
    
    const project = await Project.create(body);
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}