'use client';

import React, { useState, useEffect } from 'react';
import { trpc } from "@/server/client";
import {useYear} from "@/components/Provider/Provider";
import {capitalizeFirstLetter} from "@/app/util/yp-strings";
import GoalModal from "@/app/ui/goals-modal";

const GoalSettings = () => {
    const {year} = useYear();
    const [goals, setGoals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const {data: goalsData, refetch} = trpc.goals.getGoalsByYear.useQuery({year});

    useEffect(() => {
        if (goalsData) {
            setGoals(goalsData);
        }
    }, [goalsData]);

    const createGoal = trpc.goals.createGoal.useMutation({
        onSuccess: () => {
            refetch();
            setIsModalOpen(false);
        },
    });

    const updateGoal = trpc.goals.updateGoal.useMutation({
        onSuccess: () => {
            refetch();
            setIsModalOpen(false);
        },
    });

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedGoal(null);
    };

    const handleAddGoal = () => {
        setSelectedGoal(null); // No goal selected means it's adding a new goal
        setIsModalOpen(true);
    };

    const handleEditGoal = (goal) => {
        setSelectedGoal(goal); // Prefill data for editing
        setIsModalOpen(true);
    };

    const handleSubmitGoal = (goal) => {
        if (selectedGoal) {
            goal.target = Number(goal.target);
            goal.current_value = Number(goal.current_value);
            goal.unit_id = goal.unit_id ? Number(goal.unit_id) : null;

            updateGoal.mutate({ id: selectedGoal.id, ...goal }, {
                onError: (error) => {
                    console.error("Error updating goal:", error);
                },
            });
        } else {
            goal.target = Number(goal.target);
            goal.current_value = Number(goal.current_value);
            goal.unit_id = goal.unit_id ? Number(goal.unit_id) : null;
            goal.year = Number(year);

            createGoal.mutate(goal, {
                onError: (error) => {
                    console.error("Error creating goal:", error);
                },
            });
        }
    };

    const groupedGoals = goals.reduce((acc, goal) => {
        const categoryName = goal.category.name;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(goal);
        return acc;
    }, {});

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mt-2 mb-20 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {capitalizeFirstLetter('Goal Settings for ' + year)}
                    </h1>
                </div>
            </header>


            {/* Add New Goal Button */}
            <div className="mb-8 text-right">
                <button
                    onClick={handleAddGoal}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    Add New Goal
                </button>
            </div>

            {/* Existing Goals Grouped by Category */}
            {Object.keys(groupedGoals).map((categoryName) => (
                <div key={categoryName} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4"> {categoryName}</h3>
                    <ul className="space-y-4">
                        {groupedGoals[categoryName].map((goal) => (
                            <li
                                key={goal.id}
                                className="bg-white shadow-sm rounded-lg p-4 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-medium">{goal.name}</p>
                                    <p className="text-gray-500">
                                        Current: {goal.current_value} / Target: {goal.target}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleEditGoal(goal)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            {/* Goal Modal */}
            <GoalModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                goalData={selectedGoal}
                onSubmit={handleSubmitGoal}
            />
        </div>
    );
};

export default GoalSettings;