import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {Goal} from "types/models";
import {Prisma} from "@prisma/client";
import {getAllCategories} from "@/server/models/categories";
import {getUnits} from "@/server/models/units";
import {useYear} from "@/components/Provider/Provider";

interface EditGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    goalData: Goal | null;
    onSubmit: (goal: Goal) => void;
}

export default function GoalFormModal({ isOpen, onClose, goalData, onSubmit }: EditGoalModalProps) {
    const { year } = useYear();
    const [goal, setGoal] = useState<Goal>(goalData || {
        id: 0,
        name: '',
        description: '',
        type: 'incremental',
        current_value: new Prisma.Decimal(0),
        target: new Prisma.Decimal(0),
        year: Number(year),
        category_id: 1,
        unit_id: null
    });

    const categories = getAllCategories();
    const units = getUnits();

    useEffect(() => {
        setGoal(goalData || {
            id: 0,
            name: '',
            description: '',
            type: 'incremental',
            current_value: new Prisma.Decimal(0),
            target: new Prisma.Decimal(0),
            year: Number(year),
            category_id: 1,
            unit_id: null
        });
    }, [goalData, year]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setGoal({ ...goal, [name]: value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(goal);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">{goalData ? 'Edit Goal' : 'Add New Goal'}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Category ID:</label>
                        <select
                            id="categoryId"
                            name="category_id"
                            value={goal.category_id}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        >
                            <option value="">--- Select a category ---</option>
                            {categories?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={goal.name}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={goal.description ?? ''}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Type:</label>
                        <select
                            name="type"
                            value={goal.type}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        >
                            <option value="incremental">Incremental</option>
                            <option value="decremental">Decremental</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                        <select
                            id="unitId"
                            name="unit_id"
                            value={goal.unit_id || ''}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        >
                            <option value="">--- Select a unit ---</option>
                            {units?.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Current Value:</label>
                        <input
                            type="number"
                            name="current_value"
                            value={goal.current_value ? Number(goal.current_value) : ''}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Target:</label>
                        <input
                            type="number"
                            name="target"
                            value={goal.target ? Number(goal.target) : ''}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        {goalData ? 'Update Goal' : 'Add Goal'}
                    </button>
                </form>

                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}