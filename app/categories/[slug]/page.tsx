"use client";

import { Card } from "@/app/ui/card";
import { Suspense, useState } from "react";
import { Table } from "@/app/ui/table";
import { capitalizeFirstLetter } from "@/app/util/yp-strings";
import { trpc } from "@/server/client";
import { usePathname } from "next/navigation";

export default function Category() {
    const pathname = usePathname();
    const segments = pathname.split("/");
    const categoryIdentifier = segments[2];


    const { data, refetch } = trpc.overview.overview.useQuery({ identifier: categoryIdentifier });
    const addData = trpc.results.addData.useMutation({
        onSuccess: () => {
            // Refetch the data after successful mutation
            refetch();
        },
    });

    const goalsData = trpc.goals.getGoalsByCategoryIdentifier.useQuery({
        identifier: categoryIdentifier,
    }).data;

    let tableRows = [];
    let tableData = [];
    let goals = [];

    if (data) {
        tableRows = data[0].tableColumns;
        tableData = data[0].tableRows;
        goals = data[0].goals;
    }

    // State to control modal visibility
    const [isOpen, setIsOpen] = useState(false);

    // State to handle input values
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        goalId: "0",
        value: "0",
    });

    // Function to handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        addData.mutate({
            value: Number(formData.value),
            goal_id: Number(formData.goalId),
            date: formData.date,
        });
        setIsOpen(false); // Close the modal
    };

    return (
        <>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mt-2 mb-20 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {capitalizeFirstLetter(categoryIdentifier)}
                    </h1>
                </div>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                <Suspense>
                    {goals.map((goal: any) => {
                        return (
                            <Card
                                key={Math.random()}
                                value={goal.current_value}
                                target={goal.target}
                                currentTarget={goal.current_target}
                                type={goal.type}
                                description={goal.name}
                                identifier={goal.identifier}
                            ></Card>
                        );
                    })}
                </Suspense>
            </div>

            <div className="flex justify-center mt-10">
                {/* Button to open modal */}
                <button
                    className="ml-auto bg-green-500 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setIsOpen(true)}
                >
                    Add Data
                </button>

                {/* Modal */}
                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4">Enter Information</h2>

                            <form onSubmit={handleSubmit}>
                                {/* Date input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="date">
                                        Date:
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                {/* Goal ID input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="goalId">
                                        Goal ID:
                                    </label>
                                    <select
                                        id="goalId"
                                        name="goalId"
                                        value={formData.goalId}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        required
                                    >
                                        <option value="" disabled>
                                            Select a goal
                                        </option>

                                        {goalsData?.map((goal: any) => {
                                            return (
                                                <option key={Math.random()} value={goal.id}>
                                                    {goal.name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {/* Value input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="value">
                                        Value:
                                    </label>
                                    <input
                                        type="number"
                                        id="value"
                                        name="value"
                                        value={formData.value}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>

                                {/* Submit button */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className={"mt-5"}>
                <Table rows={tableRows} data={tableData} categoryIdentifier={categoryIdentifier}></Table>
            </div>
        </>
    );
}