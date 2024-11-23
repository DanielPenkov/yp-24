import {NextResponse} from "next/server";

export class CustomError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
        this.name = "CustomError";
    }
}

export function handleErrorResponse(res: any, error: any) {
    if (error.code === "UNAUTHORIZED") {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 },
        );
    }

    if (error instanceof CustomError) {
        res.status(error.status).json({ success: false, error: error.message });
    } else {
        console.error('Internal Server Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}