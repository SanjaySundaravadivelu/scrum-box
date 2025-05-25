"use client";

import { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { ClipboardList, LoaderPinwheel, FileCheck } from "lucide-react";

const GaugeComponent = ({ issues }) => {
  const [doneTasks, setDoneTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(1); // prevent division by 0
  const [issueCounts, setIssueCounts] = useState({
    TODO: 0,
    IN_PROGRESS: 0,
    DONE: 0,
    IN_REVIEW: 0,
  });

  useEffect(() => {
    if (!issues || issues.length === 0) return;

    const counts = issues.reduce(
      (acc, issue) => {
        acc[issue.status] = (acc[issue.status] || 0) + 1;
        return acc;
      },
      { TODO: 0, IN_PROGRESS: 0, DONE: 0, IN_REVIEW: 0 }
    );
    setIssueCounts(counts);
    const total = issues.length;
    const done = issues.filter((i) => i.status === "DONE").length;

    setDoneTasks(done);
    setTotalTasks(total);
  }, []);

  const percent = (doneTasks / totalTasks) * 100;

  const data = [
    {
      name: "Completion",
      value: percent,
      fill: "#82ca9d",
    },
  ];

  return (
    <div class="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Task Completion Status
        </h3>
        <div class="flex justify-center">
          <div>
            <GaugeChart
              id="task-gauge"
              nrOfLevels={20}
              percent={doneTasks / totalTasks}
              textColor="#ffff"
              colors={["#EA4228", "#F5CD19", "#5BE12C"]}
              arcWidth={0.3}
            />

            <p class="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
              {doneTasks} out of {totalTasks} issues completed
            </p>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p class="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            To Do
          </p>
          <p class="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {issueCounts.TODO}
            <ClipboardList fill="red" />
          </p>
        </div>
        <div class="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        <div>
          <p class="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            In Progress
          </p>
          <p class="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {issueCounts.IN_PROGRESS}
            <LoaderPinwheel />
          </p>
        </div>
        <div class="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        <div>
          <p class="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            In Review
          </p>
          <p class="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {issueCounts.IN_REVIEW}
            <FileCheck fill="green" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default GaugeComponent;
