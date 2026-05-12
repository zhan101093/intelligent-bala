import "server-only";
import { getDb } from "./db";
import type { Order, ProductStat, RevenueSummary } from "@/types";

interface SaveOrderInput {
  name: string;
  phone: string;
  city?: string;
  zip?: string;
  note?: string;
  items: { productId: number; nameKz: string; qty: number; price: number }[];
}

export async function saveOrder(data: SaveOrderInput): Promise<number> {
  const sql = getDb();
  const total = data.items.reduce((s, i) => s + i.price * i.qty, 0);

  const rows = await sql`
    INSERT INTO orders (name, phone, city, zip, note, total)
    VALUES (${data.name}, ${data.phone}, ${data.city ?? null}, ${data.zip ?? null}, ${data.note ?? null}, ${total})
    RETURNING id
  `;
  const orderId = rows[0].id as number;

  for (const item of data.items) {
    await sql`
      INSERT INTO order_items (order_id, product_id, name_kz, qty, price)
      VALUES (${orderId}, ${item.productId}, ${item.nameKz}, ${item.qty}, ${item.price})
    `;
  }

  return orderId;
}

export async function getOrders(): Promise<Order[]> {
  const sql = getDb();
  const orderRows = await sql`
    SELECT id, created_at, name, phone, city, zip, note, total
    FROM orders
    ORDER BY created_at DESC
  `;

  const itemRows = await sql`
    SELECT order_id, product_id, name_kz, qty, price
    FROM order_items
    ORDER BY id ASC
  `;

  return orderRows.map((o) => ({
    id: o.id as number,
    createdAt: o.created_at as string,
    name: o.name as string,
    phone: o.phone as string,
    city: o.city as string | null,
    zip: o.zip as string | null,
    note: o.note as string | null,
    total: o.total as number,
    items: itemRows
      .filter((i) => i.order_id === o.id)
      .map((i) => ({
        productId: i.product_id as number,
        nameKz: i.name_kz as string,
        qty: i.qty as number,
        price: i.price as number,
      })),
  }));
}

export async function getWeeklyProductStats(): Promise<ProductStat[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT oi.product_id, oi.name_kz, SUM(oi.qty) as total_qty
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY oi.product_id, oi.name_kz
    ORDER BY total_qty DESC
    LIMIT 10
  `;
  return rows.map((r) => ({
    productId: r.product_id as number,
    nameKz: r.name_kz as string,
    totalQty: Number(r.total_qty),
  }));
}

export async function getMonthlyProductStats(): Promise<ProductStat[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT oi.product_id, oi.name_kz, SUM(oi.qty) as total_qty
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY oi.product_id, oi.name_kz
    ORDER BY total_qty DESC
    LIMIT 10
  `;
  return rows.map((r) => ({
    productId: r.product_id as number,
    nameKz: r.name_kz as string,
    totalQty: Number(r.total_qty),
  }));
}

export async function getRevenueSummary(): Promise<RevenueSummary> {
  const sql = getDb();
  const weekly = await sql`
    SELECT COUNT(*)::int as order_count, COALESCE(SUM(total), 0)::int as revenue
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '7 days'
  `;
  const monthly = await sql`
    SELECT COUNT(*)::int as order_count, COALESCE(SUM(total), 0)::int as revenue
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '30 days'
  `;
  return {
    weeklyOrderCount: weekly[0].order_count as number,
    weeklyTotal: weekly[0].revenue as number,
    monthlyOrderCount: monthly[0].order_count as number,
    monthlyTotal: monthly[0].revenue as number,
  };
}
