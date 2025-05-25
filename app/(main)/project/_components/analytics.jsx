"'use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dayjs from "dayjs";
import IssuesByPriorityChart from "./IssuesByPriorityChart";
import GaugeComponent from "./gauge";
const COLORS = ["#82ca9d", "#8884d8", "#ff7300", "#ffc658"];

const Analytics = ({ sprint, issues = [] }) => {
  const [issuesByStatus, setIssuesByStatus] = useState({});
  const [issuesByAssignee, setIssuesByAssignee] = useState({});
  const [burndownData, setBurndownData] = useState([]);
  const [issuesByPriority, setIssuesByPriority] = useState({});
  const [velocityData, setVelocityData] = useState([]);
  const printRef = useRef(null);
  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("sprint-analytics.pdf");
  };

  const getDaysArray = (start, end) => {
    const arr = [];
    let currentDate = dayjs(start);
    const endDate = dayjs(end);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      arr.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }
    return arr;
  };

  useEffect(() => {
    if (!issues || issues.length === 0) return;

    const statusCount = issues.reduce((acc, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    }, {});

    const assigneeCount = issues.reduce((acc, issue) => {
      const assignee = issue.assignee?.name || "Unassigned";
      acc[assignee] = (acc[assignee] || 0) + 1;
      return acc;
    }, {});

    const priorityCount = issues.reduce((acc, issue) => {
      acc[issue.priority] = (acc[issue.priority] || 0) + 1;
      return acc;
    }, {});

    const daysArray = getDaysArray(sprint.startDate, sprint.endDate);
    const completedIssues = issues.filter((issue) => issue.status === "DONE");

    const burndown = daysArray.map((date) => {
      const completedPoints = completedIssues
        .filter((issue) =>
          dayjs(issue.updatedAt).isBefore(dayjs(date).endOf("day"))
        )
        .reduce((sum, issue) => sum + (issue.points || 0), 0);

      const totalPoints = issues.reduce(
        (sum, issue) => sum + (issue.points || 0),
        0
      );

      return {
        date: dayjs(date).format("YYYY-MM-DD"),
        RemainingPoints: totalPoints - completedPoints,
      };
    });

    const mockVelocity = Array.from({ length: 5 }).map((_, i) => ({
      sprint: `Sprint ${i + 1}`,
      points: Math.floor(Math.random() * 30) + 10,
    }));

    setIssuesByStatus(statusCount);
    setIssuesByAssignee(assigneeCount);
    setIssuesByPriority(priorityCount);
    setBurndownData(burndown);
    setVelocityData(mockVelocity);
  }, [issues, sprint.startDate, sprint.endDate]);

  const priorityData = Object.entries(issuesByPriority).map(
    ([priority, count]) => ({ name: priority, value: count })
  );
  const statusData = Object.entries(issuesByStatus).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6" ref={printRef}>
      <div className=" col-span-12 space-y-6 xl:col-span-8">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
          {" "}
          <Card>
            <CardHeader>
              <CardTitle>Issues by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <IssuesByPriorityChart issues={issues} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Issues by Assignee (Stacked by Status)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={Object.values(
                    Object.entries(
                      issues.reduce((acc, issue) => {
                        const assignee = issue.assignee?.name || "Unassigned";
                        const status = issue.status;
                        if (!acc[assignee]) acc[assignee] = { assignee };
                        acc[assignee][status] =
                          (acc[assignee][status] || 0) + 1;
                        return acc;
                      }, {})
                    )
                      .map(([_, value]) => value)
                      .sort((a, b) => {
                        const getTotal = (obj) =>
                          (obj.TODO || 0) +
                          (obj.IN_PROGRESS || 0) +
                          (obj.IN_REVIEW || 0) +
                          (obj.DONE || 0);
                        return getTotal(b) - getTotal(a);
                      })
                  )}
                >
                  <XAxis dataKey="assignee" />
                  <YAxis />
                  <Tooltip />
                  <Legend height={6} iconSize={6} />
                  <Bar barSize="50" dataKey="TODO" stackId="a" fill="#8884d8" />
                  <Bar
                    barSize="50"
                    dataKey="IN_PROGRESS"
                    stackId="a"
                    fill="#82ca9d"
                  />
                  <Bar
                    barSize="50"
                    dataKey="IN_REVIEW"
                    stackId="a"
                    fill="#ffc658"
                  />
                  <Bar barSize="50" dataKey="DONE" stackId="a" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Burndown Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={burndownData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="RemainingPoints"
                    stroke="#ff7300"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="col-span-12 xl:col-span-4 p-6">
        <div className="flex justify-center mb-4 mt-4">
          <button
            onClick={handleDownloadPDF}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Download as PDF
          </button>
        </div>
        <GaugeComponent issues={issues} />
      </div>
    </div>
  );
};

export default Analytics;
