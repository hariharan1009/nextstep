import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const verifyJwt = (token: string) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch {
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyJwt(token) as jwt.JwtPayload & { userId: string };

    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { userId } = decoded;

    const { title, company, startDate, endDate, description } =
      await req.json();

    const experience = await prisma.experience.create({
      data: {
        profile: { connect: { userId } },
        title,
        company,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
      },
    });

    return NextResponse.json({ experience });
  } catch (error) {
    console.error("Error during experience submission:", error);
    return NextResponse.json(
      { error: "Failed to submit experience." },
      { status: 400 }
    );
  }
}
