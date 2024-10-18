"use client";

import { useEffect, useState } from "react"; // Import useEffect and useState
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter for navigation
import { trpc } from "@/server/client";
import { HomeIcon } from "@heroicons/react/24/outline";
import YearDropdown from "@/app/ui/year-dropdown";
import { CogIcon } from "@heroicons/react/16/solid";
import {usePathname} from "next/navigation";
import {useYear} from "@/components/Provider/Provider";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function NavigationLinks() {
    const [isMounted, setIsMounted] = useState(false);
    const path = usePathname();
    const pathSegments = path.split("/");
    const { year } = useYear();

    // Ensure the component is mounted before rendering
    useEffect(() => {
        setIsMounted(true);
    }, []);

    let data = trpc.categories.getCategoriesByYear.useQuery({
        year: year
    }).data;
    let navigation = [];

    if (data) {
        navigation = data;
    }

    // Don't render the component until it is mounted
    if (!isMounted) {
        return null; // Return null on the server or before mounting
    }

    return (
        <div className="flex justify-between items-center px-4">
            {/* Left-side links */}
            <div className="flex items-center space-x-4">
                {/* Home Link */}
                <Link
                    key={"Home"}
                    href={"/"}
                    className={classNames(
                        pathSegments[1] === "" ? "bg-gray-900 text-white" : "text-gray-800 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium flex items-center"
                    )}
                    aria-current={pathSegments[1] === "" ? "page" : undefined}
                >
                    <HomeIcon className="h-5 mr-2" />
                    Home
                </Link>

                {/* Dynamic Category Links */}
                {navigation.map((item: any) => (
                    <Link
                        key={item.name}
                        href={"/categories" + "/" + item.identifier}
                        className={classNames(
                            pathSegments[2] === item.identifier ? "bg-gray-900 text-white" : "text-gray-800 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={pathSegments[2] === item.identifier ? "page" : undefined}
                    >
                        {item.name}
                    </Link>
                ))}

                {/* Settings Link */}
                <Link
                    key={"Settings"}
                    href={"/settings"}
                    className={classNames(
                        pathSegments[1] === "settings" ? "bg-gray-900 text-white" : "text-gray-800 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium flex items-center"
                    )}
                    aria-current={pathSegments[1] === "settings" ? "page" : undefined}
                >
                    <CogIcon className="h-5 mr-2" />
                    Settings
                </Link>
            </div>

            {/* Right-side year dropdown */}
            <div className="text-right">
                <YearDropdown />
            </div>
        </div>
    );
}