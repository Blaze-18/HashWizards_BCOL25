import { NextRequest, NextResponse } from "next/server";
import { UserPreferences } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const preferences: UserPreferences = await request.json();

    // Updated required fields to match your new backend model
    const requiredFields = [
      "age_group",
      "primary_condition",
      "communication_style",
      "learning_style",
      "attention_span",
      "primary_support",
      "interaction_pace",
      "encouragement_style",
      "correction_style",
      "response_length",
    ];

    for (const field of requiredFields) {
      if (!preferences[field as keyof UserPreferences]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Send to FastAPI backend
    const response = await fetch(
      `${process.env.FASTAPI_URL}/api/v1/process-preferences`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FastAPI error:", response.status, errorText);
      throw new Error(`FastAPI error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      submission_id: result.submission_id,
      message: "Preferences saved successfully",
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : String(error);
    return NextResponse.json(
      {
        success: false,
        message: `Failed to save preferences: ${errorMessage}`,
      },
      { status: 500 },
    );
  }
}
