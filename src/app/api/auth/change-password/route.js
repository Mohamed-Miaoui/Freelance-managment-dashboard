import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/utils/dbConnect";
import Parametres from "@/app/models/Parametres";

export async function PUT(request) {
    try {
        await dbConnect();
        const { currentPassword, newPassword } = await request.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json(
                { error: "New password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        const settings = await Parametres.getSettings();

        // Verify current password
        // If no password set yet (shouldn't happen if logged in via new flow, but handle edge case), check env
        let isCurrentValid = false;
        if (settings.password) {
            isCurrentValid = await bcrypt.compare(currentPassword, settings.password);
        } else {
            const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
            isCurrentValid = currentPassword === ADMIN_PASSWORD;
        }

        if (!isCurrentValid) {
            return NextResponse.json(
                { error: "Incorrect current password" },
                { status: 401 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        settings.password = hashedPassword;
        await settings.save();

        return NextResponse.json(
            { success: true, message: "Password updated successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Change password error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
