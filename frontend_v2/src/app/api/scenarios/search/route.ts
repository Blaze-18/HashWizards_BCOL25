import { NextRequest, NextResponse } from "next/server";
import { UserPreferences } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const {
      query,
      preferences,
      max_results,
    }: {
      query: string;
      preferences?: UserPreferences;
      max_results?: number;
    } = await request.json();

    const response = await fetch(`${API_BASE_URL}/scenarios/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        user_prefs: preferences,
        max_results: max_results || 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const scenarios = await response.json();
    return NextResponse.json({ success: true, scenarios });
  } catch (error) {
    console.error("Error searching scenarios:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search scenarios" },
      { status: 500 },
    );
  }
}
