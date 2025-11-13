import dbConnect from "@/app/utils/dbConnect";
import Project from "@/app/models/Project";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await Project.findById(id);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await Project.findByIdAndDelete(id);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(error);
  }
}