'use client';

import React, { useState, useEffect } from 'react';
import { trpc } from "@/server/client";
import { useYear } from "@/components/Provider/Provider";
import { capitalizeFirstLetter } from "@/util/yp-strings";
import EditGoalModal from "@/components/settings-page/edit-goals-modal";
import Tabs from "@/components/settings-page/tabs";
import GoalList from "@/components/settings-page/goal-list";
import ProfileSettings from "@/components/settings-page/profile-settings";

const GoalSettings = () => {
    const { year } = useYear();
    const [goals, setGoals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [openCategories, setOpenCategories] = useState({});
    const [activeTab, setActiveTab] = useState('goals'); // Tab state

    const { data: goalsData, refetch } = trpc.goals.getGoalsByYear.useQuery({ year });

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

    const toggleCategory = (categoryName) => {
        setOpenCategories((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mt-2 mb-4 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {capitalizeFirstLetter('Settings for ' + year)}
                    </h1>
                </div>
            </header>

            {/* Render Tabs */}
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Conditional Rendering based on Active Tab */}
            {activeTab === 'goals' ? (
                <GoalList
                    goals={goals}
                    handleEditGoal={handleEditGoal}
                    toggleCategory={toggleCategory}
                    openCategories={openCategories}
                    handleAddGoal={handleAddGoal}
                />
            ) : (
                <ProfileSettings />
            )}

            {/* Goal Modal */}
            {isModalOpen && (
                <EditGoalModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    goalData={selectedGoal}
                    onSubmit={handleSubmitGoal}
                />
            )}
        </div>
    );
};

export default GoalSettings;