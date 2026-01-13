// src/worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // Handle CORS (So your HTML can talk to the Worker)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // API Route: GET /api/services
    if (url.pathname === "/api/services" && method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM services ORDER BY created_at DESC"
      ).all();
      return Response.json(results, { headers: corsHeaders });
    }

    // API Route: POST /api/services (Protected)
    if (url.pathname === "/api/services" && method === "POST") {
      const authHeader = request.headers.get("Authorization");
      
      // Simple Security: Check if header matches env variable
      if (authHeader !== env.ADMIN_SECRET) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders });
      }

      const body = await request.json();
      
      await env.DB.prepare(
        "INSERT INTO services (title, description, link) VALUES (?, ?, ?)"
      )
      .bind(body.title, body.description, body.link)
      .run();

      return new Response("Created", { status: 201, headers: corsHeaders });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};
