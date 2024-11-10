import React, { ChangeEvent } from "react";
import { useYear } from "@/components/Provider/Provider";

interface YearContext {
    year: string;
    setYear: (year: string) => void;
}

const YearDropdown: React.FC = () => {
    const { year, setYear } = useYear() as YearContext; // Cast to YearContext for type safety

    // Years to display in the dropdown
    const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

    // Handle change event when the user selects a year
    const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setYear(event.target.value); // Update the context state with the selected year
    };

    return (
        <div className="inline-flex items-center space-x-2">
            {/* Dropdown */}
            <div className="relative">
                <select
                    id="yearDropdown"
                    value={year}
                    onChange={handleYearChange}
                    className="appearance-none block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white hover:bg-gray-100 transition"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                {/* Custom Dropdown Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default YearDropdown;