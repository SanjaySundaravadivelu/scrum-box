"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircleIcon, TrophyIcon, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getEpicsForProject, createEpic } from "@/actions/epics";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
const epicSchema = z
  .string()
  .min(1, { message: "Name is required" })
  .max(50, { message: "Name is too long" });

export default function Backlogfilters({
  issues,
  onFilterChange,
  projectId,
  total,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [epics, setEpics] = useState(["Epic 1", "Epic 2", "Epic 3"]);
  const [selectedEpic, setSelectedEpic] = useState("");
  const [newItem, setNewItem] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onOpen = () => {
    setIsModalOpen(true);
  };
  const [error, setError] = useState("");

  const handleCreate = async (item) => {
    try {
      await createEpic(projectId, item);
      setEpics((prev) => [...prev, item]);
      setNewItem("");
      setError("");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  const assignees = issues
    .map((issue) => issue.assignee)
    .filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );
  useEffect(() => {
    async function fetchEpics() {
      try {
        const fetchedEpics = await getEpicsForProject(projectId);
        setEpics(fetchedEpics);
      } catch (error) {
        console.error("Failed to fetch epics:", error.message);
      }
    }
    fetchEpics();
  }, [projectId]);

  useEffect(() => {
    const filteredIssues = issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAssignees.length === 0 ||
          selectedAssignees.includes(issue.assignee?.id)) &&
        (selectedPriority === "" || issue.priority === selectedPriority) &&
        (selectedEpic === "" || issue.epic === selectedEpic)
    );
    onFilterChange(filteredIssues);
  }, [searchTerm, selectedAssignees, selectedPriority, issues, selectedEpic]);

  const toggleAssignee = (assigneeId) => {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAssignees([]);
    setSelectedPriority("");
    setSelectedEpic("");
  };

  const isFiltersApplied =
    searchTerm !== "" ||
    selectedAssignees.length > 0 ||
    selectedPriority !== "" ||
    selectedEpic !== "";

  return (
    <div className="space-y-4 bg-gray-600 rounded-xl p-1 mb-2">
      <div className="flex flex-col pr-2 flex-col lg:flex-row gap-6 sm:gap-6 mt-6 ml-4 mb-4">
        <Select value={selectedEpic} onValueChange={setSelectedEpic}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Select Epic" />
          </SelectTrigger>
          <SelectContent>
            {epics.map((epic) => (
              <SelectItem key={epic} value={epic}>
                <div className="flex">
                  {" "}
                  <TrophyIcon className="mr-2" size={16} />
                  {epic}
                </div>
              </SelectItem>
            ))}
            <Button
              className="flex items-center gap-2 text-blue-500 m-2"
              onClick={onOpen}
            >
              <PlusCircleIcon size={16} />
              <span>Create New</span>
            </Button>
          </SelectContent>
        </Select>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
            <Input
              placeholder="Enter new item"
              value={newItem}
              onChange={(e) => {
                setNewItem(e.target.value);
                const parseResult = epicSchema.safeParse(e.target.value);
                if (!parseResult.success) {
                  setError(parseResult.error.errors[0].message);
                } else if (epics.includes(e.target.value)) {
                  setError("This epic already exists.");
                } else {
                  setError("");
                }
              }}
              className="mb-4"
            />
            {error && (
              <div className="flex items-center text-red-500 gap-2 mb-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <Button
              disabled={error}
              onClick={() => {
                if (newItem) {
                  handleCreate(newItem);
                }
              }}
              className="w-full mt-2"
            >
              Create
            </Button>
          </DialogContent>
        </Dialog>
        <Input
          className="w-full sm:w-72 "
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex-shrink-0">
          <div className="flex gap-2 flex-wrap">
            {assignees.map((assignee, i) => {
              const selected = selectedAssignees.includes(assignee.id);

              return (
                <div
                  key={assignee.id}
                  className={`rounded-full ring ${
                    selected ? "ring-blue-600" : "ring-black"
                  } ${i > 0 ? "-ml-6" : ""}`}
                  style={{
                    zIndex: i,
                  }}
                  onClick={() => toggleAssignee(assignee.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={assignee.imageUrl} />
                    <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              );
            })}
          </div>
        </div>

        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Badge className="" variant={"secondary"}>
          Total points <Badge className="m-2">{total}</Badge>
        </Badge>

        {isFiltersApplied && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
