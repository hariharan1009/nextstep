import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const verifyJwt = (token: string) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Server configuration error. Missing JWT secret key.");
    }
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Token is missing. Please log in." },
        { status: 401 }
      );
    }

    const decoded = verifyJwt(token) as jwt.JwtPayload & { userId: string };

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token. The token may have expired or is malformed." },
        { status: 401 }
      );
    }

    if (typeof decoded === "string") {
      return NextResponse.json(
        { error: "Invalid token structure. The token is not a valid JWT." },
        { status: 401 }
      );
    }

    if (!decoded.userId) {
      return NextResponse.json(
        { error: "User ID is missing in the token. Please log in again." },
        { status: 401 }
      );
    }

    const { userId } = decoded;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            skills: true,
            experience: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details. Please try again later." },
      { status: 500 }
    );
  }
}
