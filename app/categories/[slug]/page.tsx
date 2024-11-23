"use client";

import { Card } from "@/components/category-page/card";
import { Table } from "@/components/category-page/table";
import { capitalizeFirstLetter } from "@/util/yp-strings";
import { usePathname } from "next/navigation";
import { useYear } from "@/components/Provider/Provider";
import AddResultsModal from "@/components/category-page/add-results-modal";
import { getOverviewData, refetchData } from "@/server/models/goals";
import { trpc } from "@/server/client";
import { AlertModal } from "@/components/ui/alert-modal";
import { useState } from "react";

export default function Category() {
  const { year } = useYear();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const categoryIdentifier = segments[2];

  const data = getOverviewData(categoryIdentifier, year);
  const tableData = data.tableData;

  const trpcContext = trpc.useUtils();
  const [modal, setAlert] = useState({ show: false, type: "", message: "" });

  function onSubmitSuccess() {
    refetchData(trpcContext, categoryIdentifier, year)
      .then(() => {
          setAlert({ show: true, type: 'success', message: 'Record added successfully' });
      })
      .catch((error) => {
          setAlert({ show: true, type: 'error', message: `Error occurred: ${error.message}` });
      });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mt-2 mb-20 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {capitalizeFirstLetter(categoryIdentifier)}
          </h1>
        </div>
      </header>

      {modal.show && (
        <AlertModal
          type={modal.type === "success" ? "success" : "error"}
          message={modal.message}
          onClose={() => setAlert({ show: false, type: "", message: "" })}
        />
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {data.goals.map((goal) => (
          <Card
            key={goal.id}
            value={Number(goal.current_value)}
            target={Number(goal.target)}
            currentTarget={Number(goal.current_target)}
            type={goal.type === "incremental" ? "incremental" : "decremental"}
            description={goal.name}
            identifier={goal.name}
          />
        ))}
      </div>

      <AddResultsModal
        data={{ goals: data.goals }}
        year={Number(year)}
        categoryIdentifier={categoryIdentifier}
        onSubmitSuccess={onSubmitSuccess}
      />

      <div className={"mt-5"}>
        <Table
          goals={data.goals}
          data={tableData}
          categoryIdentifier={categoryIdentifier}
        />
      </div>
    </div>
  );
}
