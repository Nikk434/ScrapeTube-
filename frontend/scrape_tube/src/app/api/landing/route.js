import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json(); // Parse request body

    const API_BASE_URL = process.env.API_BASE_URL;
    const response = await axios.post(API_BASE_URL, body);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in Next.js API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



