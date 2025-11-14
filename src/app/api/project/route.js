import dbConnect from "@/app/utils/dbConnect";
import Project from "@/app/models/Project";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();
    const body = await req.json();
    const project = await Project.create(body);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(req, res) {
  try {
    await dbConnect();
    const projects = await Project.find();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(error);
  }
}

