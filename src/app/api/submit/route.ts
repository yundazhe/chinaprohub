import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, contactName, contactEmail, contactPhone, products, region, message } = body;

    if (!companyName || !contactEmail || !products) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      // Mock: log and return success
      console.log("[Mock Submit]", { companyName, contactEmail, products });
      return NextResponse.json({ success: true, mock: true });
    }

    const { error } = await supabase!
      .from("submissions")
      .insert({
        company_name: companyName,
        contact_name: contactName || null,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        products_text: products,
        region_text: region || null,
        message: message || null,
        status: "pending",
      });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
