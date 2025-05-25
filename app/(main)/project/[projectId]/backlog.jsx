"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import MDEditor from "@uiw/react-md-editor";
import { getAllIssues } from "@/actions/issues";
import UserAvatar from "@/components/user-avatar";
import Backlogfilters from "../_components/backlog-filters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
const Backlog = ({ projectId }) => {
  const [selectedIssue, setSelectedIssue] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
  });

  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getAllIssues);

  const [filteredIssues, setFilteredIssues] = useState(issues);

  const handleFilterChange = (newFilteredIssues) => {
    setFilteredIssues(newFilteredIssues);
    let i = 0;
    newFilteredIssues?.map((item) => {
      i = i + item.points;
    });
    setTotal(i);
  };
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (projectId) {
      fetchIssues(projectId);
      let i = 0;
      issues?.map((item) => {
        i = i + item.points;
      });
      setTotal(i);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headers = ["Title", "Assigned to", "Status", "Priority", "Points", ""];
  return (
    <div className="bg-gray-800 p-6 rounded-xl mt-6">
      {issuesLoading && <BarLoader width={"100%"} color="#36d7b7" />}
      {issues && !issuesLoading && (
        <Backlogfilters
          issues={issues}
          onFilterChange={handleFilterChange}
          projectId={projectId}
          total={total}
        />
      )}
      <Table className="bg-gray-800">
        <TableHeader>
          <tr>
            {headers.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </tr>
        </TableHeader>

        <TableBody>
          {filteredIssues?.length ? (
            filteredIssues.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.assignee?.name}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.priority}</TableCell>
                <TableCell>
                  <Badge>{row.points}</Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedIssue(row);
                        }}
                        className="flex items-center"
                      >
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <div className="flex justify-between items-center">
                          <DialogTitle className="text-3xl">
                            {selectedIssue.title}
                          </DialogTitle>
                        </div>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <div>
                            <h4 className="mt-4 mb-4 font-semibold">Status</h4>
                            <Input
                              className="bg-gray-600"
                              value={selectedIssue.status}
                              disabled={true}
                            ></Input>
                          </div>
                          <div>
                            <h4 className="mt-4 mb-4 font-semibold">
                              Priority
                            </h4>
                            <Input
                              className="bg-gray-600"
                              value={selectedIssue.priority}
                              disabled={true}
                            ></Input>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div>
                            <h4 className="mt-4 mb-4 font-semibold">Points</h4>
                            <Input
                              className="bg-gray-600"
                              value={selectedIssue.points}
                              disabled={true}
                            ></Input>
                          </div>
                          <div>
                            <h4 className="mt-4 mb-4 font-semibold">Epic</h4>
                            <Input
                              className="bg-gray-600"
                              value={selectedIssue.epic}
                              disabled={true}
                            ></Input>
                          </div>
                        </div>
                        <div>
                          <h4 className="mt-4 mb-4 font-semibold">
                            Description
                          </h4>
                          <MDEditor.Markdown
                            className="rounded px-2 py-1"
                            source={
                              selectedIssue.description
                                ? selectedIssue.description
                                : "--"
                            }
                          />
                        </div>
                        <div className="flex justify-between">
                          <div className="flex flex-col gap-2">
                            <h4 className="font-semibold">Assignee</h4>
                            <UserAvatar user={selectedIssue.assignee} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <h4 className="font-semibold">Reporter</h4>
                            <UserAvatar user={selectedIssue.reporter} />
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="h-24 text-center">
                No issues created.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Backlog;
