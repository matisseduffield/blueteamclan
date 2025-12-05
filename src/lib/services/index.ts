// API service functions

import { ApiResponse, ClanInfo, Event } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date(),
    };
  }
}

export async function getClanInfo(): Promise<ApiResponse<ClanInfo>> {
  return fetchApi<ClanInfo>("/clans");
}

export async function getMembers(): Promise<ApiResponse<ClanInfo>> {
  return fetchApi<ClanInfo>("/members");
}

export async function getEvents(): Promise<ApiResponse<Event[]>> {
  return fetchApi<Event[]>("/events");
}
