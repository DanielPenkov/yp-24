"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import YearDropdown from "@/components/year-dropdown";
import { usePathname } from "next/navigation";
import { useYear } from "@/components/Provider/Provider";
import { Icon } from "@/components/ui/icon";
import {getCategoriesWithGoals} from "@/server/models/categories";

interface Category {
  name: string;
  identifier: string;
}

function classNames(...classes: (string | boolean)[]): string {
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

  const data = getCategoriesWithGoals(year);
  const navigation: Category[] = data || [];


  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex justify-between items-center px-4">
      {/* Left-side links */}
      <div className="flex items-center space-x-4">
        {/* Home Link */}
        <Link
          key="Home"
          href="/"
          className={classNames(
            pathSegments[1] === ""
              ? "bg-gray-900 text-white text-center"
              : "text-gray-800 hover:bg-gray-700 hover:text-white text-center",
            "rounded-md px-3 py-2 text-sm font-medium text-center",
          )}
          aria-current={pathSegments[1] === "" ? "page" : undefined}
        >
          <Icon identifier="home" style="h-8 m-2 rounded-full" />
          {"Home"}
        </Link>

        {/* Dynamic Category Links */}
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={`/categories/${item.identifier}`}
            className={classNames(
              pathSegments[2] === item.identifier
                ? "bg-gray-900 text-white text-center"
                : "text-gray-800 hover:bg-gray-700 hover:text-white text-center",
              "rounded-md px-3 py-2 text-sm font-medium text-center",
            )}
            aria-current={
              pathSegments[2] === item.identifier ? "page" : undefined
            }
          >
            <Icon
              identifier={item.identifier}
              style="h-8 m-2 rounded-full text-center"
            />
            {item.name}
          </Link>
        ))}

        {/* Settings Link */}
        <Link
          key="Settings"
          href="/settings"
          className={classNames(
            pathSegments[1] === "settings"
              ? "bg-gray-900 text-white text-center"
              : "text-gray-800 hover:bg-gray-700 hover:text-white text-center",
            "rounded-md px-3 py-2 text-sm font-medium text-center",
          )}
          aria-current={pathSegments[1] === "settings" ? "page" : undefined}
        >
          <Icon
            identifier="cogWheel"
            style="h-8 m-2 rounded-full text-center"
          />
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
