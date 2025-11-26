import { NextResponse } from "next/server";

export async function POST(request) {
    const response = NextResponse.json(
        { success: true },
        { status: 200 }
    );

    // Clear cookie
    response.cookies.set("admin_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
    });

    return response;
}
