import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const YOUTUBE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_API_KEY;

// Fetch video content related to the skill
const getVideoContent = async (skill: string) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          q: `${skill} tutorial`, // Broader query
          key: YOUTUBE_API_KEY,
          maxResults: 5, // Increase to fetch more videos
          type: "video", // Fetch only video results
        },
      }
    );

    const data = response.data as {
      items: {
        id: { videoId: string };
        snippet: {
          title: string;
          thumbnails: { default: { url: string } };
        };
      }[];
    };

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Return an array of video objects
    return data.items
      .map((item) => {
        const videoId = item.id?.videoId; // Ensure videoId exists
        if (!videoId) return null; // Skip if videoId is missing

        return {
          title: item.snippet.title,
          link: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail: item.snippet.thumbnails?.default?.url || "", // Fallback if thumbnail is missing
        };
      })
      .filter(Boolean); // Filter out any null values
  } catch (error) {
    console.error("Error fetching video content:", error);
    throw new Error("Failed to fetch video content");
  }
};

// Fetch book content related to the skill
const getBookContent = async (skill: string) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes`,
      {
        params: {
          q: skill,
          key: GOOGLE_BOOKS_API_KEY,
          maxResults: 1,
        },
      }
    );

    const data = response.data as {
      items: { volumeInfo: { title: string; description: string } }[];
    };

    if (!data.items || data.items.length === 0) {
      return { title: "No book content found", description: "" };
    }

    return {
      title: data.items[0].volumeInfo.title,
      description:
        data.items[0].volumeInfo.description || "No description available",
    };
  } catch (error) {
    console.error("Error fetching book content:", error);
    throw new Error("Failed to fetch book content");
  }
};

// Main GET handler for processing the request
export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const skill = searchParams.get("skill");

  if (!skill) {
    return NextResponse.json({ error: "Skill is required" }, { status: 400 });
  }

  try {
    const videos = await getVideoContent(skill);
    const book = await getBookContent(skill);

    return NextResponse.json({ skill, videos, book });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
};
