"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import MDEditor from "@uiw/react-md-editor";
import { getAllIssues } from "@/actions/issues";
import { getBlocker } from "@/actions/blockers";
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
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Backlog = ({ projectId }) => {
  const [selectedIssue, setSelectedIssue] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
  });

  const [selectedBlockers, setSelectedBlockers] = useState([]);

  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getAllIssues);

  const {
    loading: blockersLoading,
    error: blockersError,
    fn: fetchBlockers,
    data: blockers,
    setData: setBlockers,
  } = useFetch(getBlocker);

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
      fetchBlockers();
      let i = 0;
      issues?.map((item) => {
        i = i + item.points;
      });
      setTotal(i);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    console.log(blockers, selectedBlockers, issues);
  }, [selectedBlockers]);

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
                          const related = blockers?.filter(
                            (b) => b.id === row.id
                          );
                          setSelectedBlockers(related || []);
                        }}
                        className="flex items-center"
                      >
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <div className="flex justify-between items-center">
                          <DialogTitle className="text-3xl">
                            {selectedIssue.title}
                          </DialogTitle>
                        </div>
                      </DialogHeader>

                      {/* Tabs */}
                      <div className="mt-4">
                        <Tabs defaultValue="info" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="info">Info</TabsTrigger>
                            <TabsTrigger value="blockers">Blockers</TabsTrigger>
                          </TabsList>

                          {/* Info Tab */}
                          <TabsContent value="info" className="mt-4 space-y-4">
                            {/* Status + Priority */}
                            <div className="flex items-center space-x-2">
                              <div>
                                <h4 className="mt-4 mb-2 font-semibold">
                                  Status
                                </h4>
                                <Input
                                  className="bg-gray-600"
                                  value={selectedIssue.status}
                                  disabled
                                />
                              </div>
                              <div>
                                <h4 className="mt-4 mb-2 font-semibold">
                                  Priority
                                </h4>
                                <Input
                                  className="bg-gray-600"
                                  value={selectedIssue.priority}
                                  disabled
                                />
                              </div>
                            </div>

                            {/* Points + Epic */}
                            <div className="flex items-center space-x-2">
                              <div>
                                <h4 className="mt-4 mb-2 font-semibold">
                                  Points
                                </h4>
                                <Input
                                  className="bg-gray-600"
                                  value={selectedIssue.points}
                                  disabled
                                />
                              </div>
                              <div>
                                <h4 className="mt-4 mb-2 font-semibold">
                                  Epic
                                </h4>
                                <Input
                                  className="bg-gray-600"
                                  value={selectedIssue.epic}
                                  disabled
                                />
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <h4 className="mt-4 mb-2 font-semibold">
                                Description
                              </h4>
                              <MDEditor.Markdown
                                className="rounded px-2 py-1"
                                source={selectedIssue.description || "--"}
                              />
                            </div>

                            {/* Assignee + Reporter */}
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
                          </TabsContent>

                          {/* Blockers Tab */}
                          <TabsContent value="blockers" className="mt-4">
                            {blockersLoading ? (
                              <p className="text-gray-400 text-sm">
                                Loading blockers...
                              </p>
                            ) : selectedBlockers &&
                              selectedBlockers.length > 0 ? (
                              selectedBlockers.map((blocker) => (
                                <div
                                  key={blocker.id}
                                  className="space-y-4 p-4 rounded-lg border bg-gray-700 mb-4"
                                >
                                  {/* Reason */}
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Reason
                                    </label>
                                    <Textarea
                                      value={blocker.reason || "--"}
                                      disabled
                                      className="bg-gray-600"
                                    />
                                  </div>

                                  {/* Responsible */}
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      Responsible
                                    </label>
                                    {blocker.responsible?.length ? (
                                      <div className="flex flex-wrap gap-2">
                                        {blocker.responsible.map((person) => (
                                          <UserAvatar
                                            key={person.id}
                                            user={person}
                                            size="sm"
                                          />
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-gray-400 text-sm">
                                        --
                                      </p>
                                    )}
                                  </div>

                                  {/* History */}
                                  <div>
                                    <label className="block text-sm font-medium mb-2">
                                      History
                                    </label>
                                    <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2 bg-gray-600">
                                      {blocker.history?.length ? (
                                        blocker.history.map((h, i) => (
                                          <div
                                            key={i}
                                            className="flex items-start gap-3 bg-gray-500 rounded p-2"
                                          >
                                            <p className="text-sm text-gray-200">
                                              {h.comment}
                                            </p>
                                            {h.Meeting_Link && (
                                              <a
                                                href={h.Meeting_Link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-400 underline ml-auto"
                                              >
                                                <ExternalLink className="ml-4 h-4 w-4" />
                                              </a>
                                            )}
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-gray-400 text-sm">
                                          No history
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-400 text-sm">
                                No blockers for this issue
                              </p>
                            )}
                          </TabsContent>
                        </Tabs>
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
