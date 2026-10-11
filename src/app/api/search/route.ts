import { NextRequest, NextResponse } from "next/server";
import { searchEnterprises } from "@/lib/search";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || undefined;
  const region = searchParams.get("region") || undefined;
  const certification = searchParams.get("certification") || undefined;
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const results = await searchEnterprises(query, {
      category,
      region,
      certification,
      limit,
      offset,
    });
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed", hits: [], total: 0, processingTimeMs: 0, query },
      { status: 500 }
    );
  }
}
