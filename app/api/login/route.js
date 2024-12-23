export async function POST(req) {
    const body = await req.json();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  
    if (res.ok) {
      return new Response(await res.text(), { status: res.status });
    } else {
      return new Response(await res.text(), { status: res.status });
    }
  }
  