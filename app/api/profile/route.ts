import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const verifyJwt = (token: string) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Server configuration error. Missing JWT secret key.");
    }
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};

// GET Method: Fetch user profile
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

    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return NextResponse.json(
        { error: "Invalid or expired token. Please log in again." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
      return NextResponse.json(
        { error: "User not found. Please check your credentials." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: {
        fullName: user.fullName,
        bio: user.profile?.bio || "",
        skills:
          user.profile?.skills.map((skill) => ({
            id: skill.id,
            name: skill.name,
          })) || [],
        experience:
          user.profile?.experience.map((exp) => ({
            id: exp.id,
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
            endDate: exp.endDate
              ? exp.endDate.toISOString().split("T")[0]
              : null,
            description: exp.description || "",
          })) || [],
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile. Please try again later." },
      { status: 500 }
    );
  }
}

// POST Method: Update user profile
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Token is missing. Please log in." },
        { status: 401 }
      );
    }

    const decoded = verifyJwt(token) as jwt.JwtPayload & { userId: string };

    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return NextResponse.json(
        { error: "Invalid or expired token. Please log in again." },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    const { fullName, bio, skills, experience } = await req.json();

    if (!fullName) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    if (!skills || !Array.isArray(skills)) {
      return NextResponse.json(
        { error: "Skills are required and should be an array." },
        { status: 400 }
      );
    }

    if (!experience || !Array.isArray(experience)) {
      return NextResponse.json(
        { error: "Experience is required and should be an array." },
        { status: 400 }
      );
    }

    // Find or create skills
    const skillIds = await Promise.all(
      skills.map(async (skillName: string) => {
        let skill = await prisma.skill.findFirst({
          where: { name: skillName },
        });

        if (!skill) {
          skill = await prisma.skill.create({
            data: { name: skillName },
          });
        }
        return skill.id;
      })
    );

    // Upsert profile and experiences
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        bio,
        skills: {
          set: [], // Clear existing skills
          connect: skillIds.map((id) => ({ id })),
        },
        experience: {
          deleteMany: {}, // Clear existing experiences
          create: experience.map((exp: any) => ({
            title: exp.title,
            company: exp.company,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description,
          })),
        },
      },
      create: {
        userId,
        bio,
        skills: {
          connect: skillIds.map((id) => ({ id })),
        },
        experience: {
          create: experience.map((exp: any) => ({
            title: exp.title,
            company: exp.company,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description,
          })),
        },
      },
      include: {
        skills: true,
        experience: true,
      },
    });

    // Update full name if changed
    await prisma.user.update({
      where: { id: userId },
      data: { fullName },
    });

    return NextResponse.json({
      profile: {
        fullName,
        bio: profile.bio,
        skills: profile.skills.map((skill) => ({
          id: skill.id,
          name: skill.name,
        })),
        experience: profile.experience.map((exp) => ({
          id: exp.id,
          title: exp.title,
          company: exp.company,
          startDate: exp.startDate.toISOString().split("T")[0],
          endDate: exp.endDate ? exp.endDate.toISOString().split("T")[0] : null,
          description: exp.description || "",
        })),
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile. Please try again later." },
      { status: 500 }
    );
  }
}
