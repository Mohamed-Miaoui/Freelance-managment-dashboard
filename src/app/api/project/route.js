import dbConnect from "@/app/utils/dbConnect";
import Project from "@/app/models/Project";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await dbConnect();
    const project = await Project.create(req.body);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(req, res) {
  try {
    const projects = await Project.find();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req, res) {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function DELETE(req, res) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(error);
  }
}