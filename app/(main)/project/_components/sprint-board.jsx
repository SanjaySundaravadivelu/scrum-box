"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import useFetch from "@/hooks/use-fetch";

import statuses from "@/data/status";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";
import {
  getBlocker, 
  createBlocker,
  updateBlocker,
  deleteBlocker,
} from "@/actions/blockers";

import SprintManager from "./sprint-manager";
import IssueCreationDrawer from "./create-issue";
import IssueCard from "@/components/issue-card";
import BoardFilters from "./board-filters";

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export default function SprintBoard({ sprints, projectId, orgId }) {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);
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
  };

  useEffect(() => {
    if (currentSprint.id) {
      fetchIssues(currentSprint.id);
      fetchBlockers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSprint.id]);

  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const handleIssueCreated = () => {
    fetchIssues(currentSprint.id);
  };

  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueOrder);

  const onDragEnd = async (result) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update board");
      return;
    }
    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end");
      return;
    }
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderedData = [...issues];

    const sourceList = newOrderedData.filter(
      (list) => list.status === source.droppableId
    );
    const destinationList = newOrderedData.filter(
      (list) => list.status === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(
        sourceList,
        source.index,
        destination.index
      );
      reorderedCards.forEach((card, i) => {
        card.order = i;
      });
    } else {
      const [movedCard] = sourceList.splice(source.index, 1);
      movedCard.status = destination.droppableId;
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => (card.order = i));
      destinationList.forEach((card, i) => (card.order = i));
    }

    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    setIssues(newOrderedData, sortedIssues);

    updateIssueOrderFn(sortedIssues);
  };

  // ✅ Blocker handlers
  const handleCreateBlocker = async (issueId, data) => {
    try {
      await createBlocker(issueId, data);
      toast.success("Blocker created");
      fetchIssues(currentSprint.id);
      fetchBlockers();
    } catch (err) {
      toast.error("Failed to create blocker");
    }
  };

  const handleUpdateBlocker = async (issueId, data) => {
    try {
      await updateBlocker(issueId, data);
      toast.success("Blocker updated");
      fetchIssues(currentSprint.id);
      fetchBlockers();
    } catch (err) {
      toast.error("Failed to update blocker");
    }
  };

  const handleDeleteBlocker = async (issueId) => {
    try {
      await deleteBlocker(issueId);
      toast.success("Blocker deleted");
      fetchIssues(currentSprint.id);
    } catch (err) {
      toast.error("Failed to delete blocker");
    }
  };

  if (issuesError) return <div>Error loading issues</div>;

  return (
    <div className="flex flex-col">
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {issues && !issuesLoading && (
        <BoardFilters
          issues={issues}
          onFilterChange={handleFilterChange}
          sprint={currentSprint}
        />
      )}

      {updateIssuesError && (
        <p className="text-red-500 mt-2">{updateIssuesError.message}</p>
      )}
      {(updateIssuesLoading || issuesLoading) && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <h3 className="font-semibold mb-2 text-center">
                    {column.name}
                  </h3>
                  {filteredIssues
                    ?.filter((issue) => issue.status === column.key)
                    .map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={updateIssuesLoading}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard
                              orgId={orgId}
                              issue={issue}
                              onDelete={() => fetchIssues(currentSprint.id)}
                              onUpdate={(updated) =>
                                setIssues((issues) =>
                                  issues.map((i) =>
                                    i.id === updated.id ? updated : i
                                  )
                                )
                              }
                              // ✅ Blocker actions
                              onBlockerCreate={handleCreateBlocker}
                              onBlockerUpdate={handleUpdateBlocker}
                              onBlockerDelete={handleDeleteBlocker}
                              blockers={blockers}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  {column.key === "TODO" &&
                    currentSprint.status !== "COMPLETED" && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => handleAddIssue(column.key)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Issue
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
}
