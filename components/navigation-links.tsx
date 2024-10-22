"use client";

import { useEffect, useState } from "react"; // Import useEffect and useState
import Link from "next/link";
import { trpc } from "@/server/client";
import YearDropdown from "@/components/year-dropdown";
import {usePathname} from "next/navigation";
import {useYear} from "@/components/Provider/Provider";
import {Icon} from "@/components/ui/icon";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function NavigationLinks() {
    const [isMounted, setIsMounted] = useState(false);
    const path = usePathname();
    const pathSegments = path.split("/");
    const { year } = useYear();

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
                        pathSegments[1] === "" ? "bg-gray-900 text-white text-center" : "text-gray-800 hover:bg-gray-700 hover:text-white text-center",
                        "rounded-md px-3 py-2 text-sm font-medium text-center"
                    )}
                    aria-current={pathSegments[1] === "" ? "page" : undefined}
                >
                    <Icon identifier={'home'} style={"h-8 m-2 rounded-full "}></Icon>
                    {"Home"}
                </Link>

                {/* Dynamic Category Links */}
                {navigation.map((item: any) => (
                    <Link
                        key={item.name}
                        href={"/categories" + "/" + item.identifier}
                        className={classNames(
                            pathSegments[2] === item.identifier ? "bg-gray-900 text-white text-center" : "text-gray-800 hover:bg-gray-700 hover:text-white text-center",
                            "rounded-md px-3 py-2 text-sm font-medium text-center"
                        )}
                        aria-current={pathSegments[2] === item.identifier ? "page" : undefined}
                    >
                        <Icon identifier={item.identifier} style={"h-8 m-2 rounded-full text-center"}></Icon>
                        {item.name}
                    </Link>
                ))}

                {/* Settings Link */}
                <Link
                    key={"Settings"}
                    href={"/settings"}
                    className={classNames(
                        pathSegments[1] === "settings" ? "bg-gray-900 text-white text-center" : "text-gray-800 hover:bg-gray-700 hover:text-white text-center",
                        "rounded-md px-3 py-2 text-sm font-medium text-center"
                    )}
                    aria-current={pathSegments[1] === "settings" ? "page" : undefined}
                >
                    <Icon identifier={'cogWheel'} style={"h-8 m-2 rounded-full text-center"}></Icon>
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