import React, { ChangeEvent, FormEvent, useState } from "react";
import { Goal } from "types/models";
import {
  getGoalsByCategory,
  getGoalsCurrentValues,
} from "@/server/models/goals";
import { addResult } from "@/server/models/results";
import LoadingSpinner from "@/components/ui/loading";

export default function AddResultsModal({
  data,
  year,
  categoryIdentifier,
  onSubmitSuccess,
}: {
  data: { goals?: Goal[] };
  year: number;
  categoryIdentifier: string;
  onSubmitSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    date: string;
    goalId: string;
    value: string;
  }>({
    date: new Date().toISOString().split("T")[0],
    goalId: "0",
    value: "0",
  });

  const goalsData = getGoalsByCategory(categoryIdentifier, year);
  const addData = addResult();

  if (!data) {
    return <LoadingSpinner />;
  }

  const goals = data.goals ?? [];
  const goalsCurrentValues = getGoalsCurrentValues(goals);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      let updatedData = {
        ...prevData,
        [name]: value,
      };

      if (name === "goalId") {
        updatedData = {
          ...updatedData,
          value: goalsCurrentValues[value]
            ? goalsCurrentValues[value].toString()
            : "0",
        };
      }

      return updatedData;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    addData.mutate(
      {
        value: Number(formData.value),
        goal_id: Number(formData.goalId),
        date: formData.date,
      },
      {
        onSuccess: () => {
          onSubmitSuccess();
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <div>
      <div className="flex justify-center mt-10">
        <button
          className="ml-auto bg-green-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsOpen(true)}
        >
          Add Data
        </button>

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
                    <option value="">--- Select a goal ---</option>

                    {goalsData?.map((goal: Goal) => (
                      <option key={goal.id} value={goal.id.toString()}>
                        {goal.name}
                      </option>
                    ))}
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
    </div>
  );
}
