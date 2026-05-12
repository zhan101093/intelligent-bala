import { saveOrder } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, city, zip, note, items } = body;

    if (!name?.trim() || !phone?.trim()) {
      return Response.json({ error: "name and phone required" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ error: "items required" }, { status: 400 });
    }

    const orderId = await saveOrder({ name, phone, city, zip, note, items });
    return Response.json({ ok: true, orderId }, { status: 201 });
  } catch (err) {
    console.error("Failed to save order:", err);
    return Response.json({ error: "internal error" }, { status: 500 });
  }
}
