"use client";

import { trpc } from "@/server/client";

import { useState } from "react";

export default function Test() {
    const categories = trpc.categories.getCategories.useQuery();

    console.log(categories);

    return (
        <div className="grid grid-cols-4 gap-5">
            {JSON.stringify(categories.data)}
        </div>
    );
}
