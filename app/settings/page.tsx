"use client";

import React, { useState } from "react";
import { useYear } from "@/components/Provider/Provider";
import { capitalizeFirstLetter } from "@/util/yp-strings";
import GoalFormModal from "@/components/settings-page/goal-form-modal";
import Tabs from "@/components/settings-page/tabs";
import GoalList from "@/components/settings-page/goal-list";
import ProfileSettings from "@/components/settings-page/profile-settings";
import { Goal } from "types/models";
import {
  createGoalEntity,
  getGoalsByYear,
  refetchYearlyGoals,
  updateGoalEntity,
} from "@/server/models/goals";
import { trpc } from "@/server/client";
import {AlertModal} from "@/components/ui/alert-modal";

const GoalSettings = () => {
  const trpcContext = trpc.useUtils();
  const { year } = useYear();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [activeTab, setActiveTab] = useState<"goals" | "profile">("goals");

  const goals = getGoalsByYear(year);

  const createGoal = createGoalEntity();
  const updateGoal = updateGoalEntity();
  const [modal, setModal] = useState({ show: false, type: "", message: "" });

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedGoal(null);
  };

  const handleAddGoal = () => {
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleSubmitGoal = (goal: Goal) => {
    if (selectedGoal) {
      updateGoal.mutate(
        {
          id: goal.id,
          name: goal.name,
          description: goal.description ?? "",
          current_value: Number(goal.current_value) ?? 0,
          target: Number(goal.target) ?? 0,
          unit_id: goal.unit_id ? Number(goal.unit_id) : null,
        },
        {
          onSuccess: (data) => {
            afterSubmit();

            setModal({
              show: true,
              type: "success",
              message: "Goal updated successfully",
            });
          },
          onError: (error) => {
            afterSubmit();
            setModal({
              show: true,
              type: "error",
              message: `Error occurred: ${error.message}`,
            });
          },
        },
      );
    } else {
      createGoal.mutate(
        {
          category_id: Number(goal.category_id),
          unit_id: goal.unit_id ? Number(goal.unit_id) : null,
          name: goal.name,
          description: goal.description ?? "",
          type: goal.type === "incremental" ? "incremental" : "decremental",
          year: goal.year,
          current_value: Number(goal.current_value) ?? 0,
          target: Number(goal.target) ?? 0,
        },
        {
          onSuccess: (data) => {
            afterSubmit();
            setModal({
              show: true,
              type: "success",
              message: "Goal created successfully",
            });
          },
          onError: (error) => {
            afterSubmit();
            setModal({
              show: true,
              type: "error",
              message: `Error occurred: ${error.message}`,
            });
          },
        },
      );
    }

    handleModalClose();
  };

  function afterSubmit() {
    refetchYearlyGoals(trpcContext, year).then(() => {});
  }

  const toggleCategory = (categoryName: string) => {
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
            {capitalizeFirstLetter("Settings for " + year)}
          </h1>
        </div>
      </header>

      {modal.show && (
          <AlertModal
              type={modal.type === "success" ? "success" : "error"}
              message={modal.message}
              onClose={() => setModal({ show: false, type: "", message: "" })}
          />
      )}


      {/* Render Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Conditional Rendering based on Active Tab */}
      {activeTab === "goals" ? (
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
        <GoalFormModal
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
