import { NextResponse } from "next/server"

export async function POST() {
    const response = NextResponse.json({ success: true, message: "Signed out" })

    // Clear the auth cookie
    response.cookies.set("atlas_session", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    })

    return response
}
