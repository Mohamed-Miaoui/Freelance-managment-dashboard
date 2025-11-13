import dbConnect from "@/app/utils/dbConnect";
import Project from "@/app/models/Project";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { userId } = await params;
    const projects = await Project.find({ client_id: userId });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(error);
  }
}