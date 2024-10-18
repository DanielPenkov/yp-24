"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/server/client";

// Define the type of the context
interface YearContextType {
    year: string;
    setYear: (year: string) => void;
}

const YearContext = createContext<YearContextType | undefined>(undefined);

const YearProvider = ({ children }: { children: ReactNode }) => {
    const [year, setYear] = useState(new Date().getFullYear().toString());

    return (
        <YearContext.Provider value={{ year, setYear }}>
            {children}
        </YearContext.Provider>
    );
};

// Main Provider wrapping TRPC and CounterProvider
function Provider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({}));
    const [trpcClient] = useState(
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
                }),
            ],
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <YearProvider>
                    {children}
                </YearProvider>
            </QueryClientProvider>
        </trpc.Provider>
    );
}

const useYear = () => {
    const context = useContext(YearContext);
    if (!context) {
        throw new Error("useYear must be used within a YearProvider");
    }
    return context;
};

export { Provider, YearContext, YearProvider, useYear };