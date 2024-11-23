import { trpc } from "@/server/trpc";
import { NextRequest, NextResponse } from "next/server";
import { appRouter } from "@/server";
import { handleErrorResponse } from "@/app/utils/errorHandler";

function createContext(req: NextRequest): {
  apiKey: string | null;
} {
  try {
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      return {
        apiKey: authHeader,
      };
    }
  } catch (error) {
    console.error("Invalid or missing token:", error);

    return { apiKey: null };
  }

  return { apiKey: null };
}

const callerFactory = trpc.createCallerFactory(appRouter);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const caller = callerFactory(createContext(req));

    const result = await caller.webhooks.handleWebhook({ data: body });

    return NextResponse.json(result);
  } catch (error: any) {
    return handleErrorResponse(NextResponse, error);
  }
}
