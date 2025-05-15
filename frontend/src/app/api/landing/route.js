// import axios from "axios";

// export async function POST(req) {
//   try {
//     const body = await req.json(); // Parse request body

//     const API_BASE_URL = "http://127.0.0.1:5000/api/download";
//     const response = await axios.post(API_BASE_URL, body);

//     return new Response(JSON.stringify(response.data), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error in Next.js API:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }



export async function POST(req) {
  try {
    const body = await req.json();

    const flaskRes = await fetch('http://127.0.0.1:5000/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // If Flask returned an error
    if (!flaskRes.ok) {
      const errorBody = await flaskRes.text();
      return new Response(errorBody, {
        status: flaskRes.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Stream the video file from Flask to the client
    const contentDisposition = flaskRes.headers.get('Content-Disposition') || '';
    const contentType = flaskRes.headers.get('Content-Type') || 'application/octet-stream';

    return new Response(flaskRes.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });

  } catch (error) {
    console.error('Error in Next.js API:', error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
