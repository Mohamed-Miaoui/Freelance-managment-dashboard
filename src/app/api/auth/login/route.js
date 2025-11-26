import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/utils/dbConnect";
import Parametres from "@/app/models/Parametres";

const secret = new TextEncoder().encode(
    process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long"
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request) {
    try {
        await dbConnect();
        const { password } = await request.json();

        // Get settings from DB
        let settings = await Parametres.getSettings();

        let isValid = false;

        // If DB has a password, use it
        if (settings.password) {
            isValid = await bcrypt.compare(password, settings.password);
        } else {
            // Fallback to env password if no password in DB
            // AND migrate it to DB for future use (optional but good for consistency)
            if (password === ADMIN_PASSWORD) {
                isValid = true;
                // Migration: Hash and save the env password to DB
                const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
                settings.password = hashedPassword;
                await settings.save();
            }
        }

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );
        }

        // Create JWT
        const token = await new SignJWT({ role: "admin" })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);

        // Create response
        const response = NextResponse.json(
            { success: true },
            { status: 200 }
        );

        // Set cookie
        response.cookies.set("admin_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
