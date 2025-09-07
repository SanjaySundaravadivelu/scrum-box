"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./user-avatar";
import useFetch from "@/hooks/use-fetch";

import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarLoader } from "react-spinners";
import {
  ExternalLink,
  AlertTriangle,
  Clock,
  Target,
  User,
  X,
  Plus,
  CheckCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import statuses from "@/data/status";
import { deleteIssue, updateIssue } from "@/actions/issues";
import { Badge } from "./ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrganizationUsers } from "@/actions/organizations";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const getPriorityColor = (priority) => {
  switch (priority) {
    case "LOW":
      return "bg-green-100 text-green-800 border-green-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "HIGH":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "URGENT":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getBlockerStatusInfo = (isBlocker, isResolved) => {
  if (!isBlocker) {
    return {
      label: "No Blockers",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <CheckCircle className="h-3 w-3" />,
    };
  }
  if (isResolved) {
    return {
      label: "Resolved",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <CheckCircle className="h-3 w-3" />,
    };
  }
  return {
    label: "Pending",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: <AlertTriangle className="h-3 w-3" />,
  };
};

export default function IssueDetailsDialog({
  isOpen,
  onClose,
  issue,
  onDelete = () => {},
  onUpdate = () => {},
  BlockerUpdate = () => {},
  BlockerCreate = () => {},
  borderCol = "",
  orgId,
  blocker,
}) {
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);
  const [points, setPoints] = useState(issue.points);

  const { user } = useUser();
  const { membership } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();

  const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleted,
  } = useFetch(deleteIssue);
  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUsers);
  const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updated,
  } = useFetch(updateIssue);

  const [blockerForm, setBlockerForm] = useState({
    id: blocker?.id || issue.id,
    isBlocker: (blocker && true) || false,
    isResolved: blocker?.isResolved || false,
    reason: blocker?.reason || "",
    reporter: blocker?.reporter || issue.reporter,
    responsible: blocker?.responsible || [],
    history: blocker?.history || [],
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteIssueFn(issue.id);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    updateIssueFn(issue.id, { status: newStatus, priority, points });
  };

  const handlePriorityChange = async (newPriority) => {
    setPriority(newPriority);
    updateIssueFn(issue.id, { status, priority: newPriority, points });
  };

  const handlePointsChange = async (points) => {
    setPoints(points);
    updateIssueFn(issue.id, { status, points: points, priority });
  };

  // Blocker form handlers
  const updateBlockerForm = (updates) => {
    setBlockerForm((prev) => ({ ...prev, ...updates }));
    // Here you would typically call your API to update the blocker information
  };

  const handleBlockerToggle = (checked) => {
    updateBlockerForm({
      isBlocker: true,
      isResolved: false,
      reason: checked ? blockerForm.reason : "",
      responsible: checked ? blockerForm.responsible : [],
    });
    handleSaveBlocker({
      ...blockerForm,
      ...{
        isBlocker: true,
        isResolved: false,
        reason: checked ? blockerForm.reason : "",
        responsible: checked ? blockerForm.responsible : [],
      },
    });
  };

  const handleResolveBlocker = () => {
    const resolvedUpdate = {
      isResolved: true,
      history: [
        ...blockerForm.history,
        {
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          comment: `Blocker resolved by ${
            user.firstName || "User"
          } on ${new Date().toLocaleDateString()}`,
          user: user.firstName || "User",
        },
      ],
    };
    updateBlockerForm(resolvedUpdate);
    handleSaveBlocker({ ...blockerForm, ...resolvedUpdate });
  };
  const handleSaveBlocker = async (update) => {
    try {
      let updated;
      if (blocker) {
        BlockerUpdate(issue.id, update);
      } else {
        BlockerCreate(issue.id, update);
      }
    } catch (error) {
      console.log(error);
    }
    console.log("Save Blocker clicked", update);
    // TODO: connect to API later
  };

  const addResponsiblePerson = (personId) => {
    if (!blockerForm.responsible.some((p) => p.id === personId)) {
      const person = users.find((u) => u.id === personId);
      updateBlockerForm({
        responsible: [...blockerForm.responsible, person],
      });
    }
  };

  const removeResponsiblePerson = (personId) => {
    updateBlockerForm({
      responsible: blockerForm.responsible.filter((p) => p.id !== personId),
    });
  };

  useEffect(() => {
    if (deleted) {
      onClose();
      onDelete();
    }
    if (updated) {
      onUpdate(updated);
    }
  }, [deleted, updated, deleteLoading, updateLoading]);

  useEffect(() => {
    console.log(users, issue, blocker);
  }, [users]);
  useEffect(() => {
    fetchUsers(orgId);
  }, [orgId]);
  useEffect(() => {
    blocker;
  }, []);
  const canChange =
    user.id === issue.reporter.clerkUserId || membership.role === "org:admin";

  const handleGoToProject = () => {
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
  };

  const isProjectPage = !pathname.startsWith("/project/");
  const blockerStatus = getBlockerStatusInfo(
    blockerForm.isBlocker,
    blockerForm.isResolved
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-md">
                  {issue.title}
                </DialogTitle>
                <Badge variant="outline" className="text-xs">
                  #{issue.id}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {isProjectPage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGoToProject}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Project
                  </Button>
                )}
              </div>
            </div>
            {(updateLoading || deleteLoading) && (
              <BarLoader width={"100%"} color="#3b82f6" className="mt-2" />
            )}
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel - Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger
                    value="blockers"
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Blockers
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Description
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <MDEditor.Markdown
                        source={
                          issue.description
                            ? issue.description
                            : "*No description provided*"
                        }
                      />
                    </div>
                  </div>

                  {/* People */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Assignee
                      </h4>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                        <UserAvatar user={issue.assignee} showName />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Reporter
                      </h4>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                        <UserAvatar user={issue.reporter} showName />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Status
                      </h4>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                        <Select
                          value={status}
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((option) => (
                              <SelectItem key={option.key} value={option.key}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Priority
                      </h4>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                        <Select
                          value={priority}
                          onValueChange={handlePriorityChange}
                          disabled={!canChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorityOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      option === "LOW"
                                        ? "bg-green-500"
                                        : option === "MEDIUM"
                                        ? "bg-yellow-500"
                                        : option === "HIGH"
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                    }`}
                                  />
                                  {option}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="blockers" className="space-y-4">
                  {/* Blocker Toggle and Resolve Button */}
                  <div className="flex items-center justify-between">
                    {blockerForm.isBlocker && !blockerForm.isResolved && (
                      <Button
                        onClick={handleResolveBlocker}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Resolve
                      </Button>
                    )}
                    {!blockerForm.isResolved && (
                      <Button
                        onClick={handleBlockerToggle}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Save
                      </Button>
                    )}
                  </div>

                  <div
                    className={`space-y-4 ${
                      blockerForm.isResolved ? "opacity-60" : ""
                    }`}
                  >
                    {/* Blocker Status Indicator */}
                    {blockerForm.isResolved && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-300">
                            This blocker has been resolved
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Reason */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Reason
                      </label>
                      <Textarea
                        value={blockerForm.reason}
                        onChange={(e) =>
                          updateBlockerForm({ reason: e.target.value })
                        }
                        placeholder="Enter reason for blockage..."
                        className="resize-none"
                        rows={3}
                        disabled={blockerForm.isResolved}
                      />
                    </div>

                    {/* Responsible Persons - Multiple Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Responsible Persons
                      </label>

                      {/* Selected Persons */}
                      {blockerForm.responsible.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {blockerForm.responsible.map((person) => (
                            <div
                              key={person.id}
                              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-full px-3 py-1 border"
                            >
                              <UserAvatar user={person} size="xs" />

                              {!blockerForm.isResolved && (
                                <button
                                  onClick={() =>
                                    removeResponsiblePerson(person.id)
                                  }
                                  className="ml-1 text-gray-400 hover:text-red-500"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Person Dropdown */}
                      {!blockerForm.isResolved && (
                        <Select onValueChange={addResponsiblePerson}>
                          <SelectTrigger>
                            <SelectValue placeholder="Add responsible person" />
                          </SelectTrigger>
                          <SelectContent>
                            {users &&
                              users
                                ?.filter(
                                  (u) =>
                                    !blockerForm.responsible.some(
                                      (p) => p.id === u.id
                                    )
                                )
                                .map((u) => (
                                  <SelectItem key={u.id} value={u.id}>
                                    <div className="flex items-center gap-2">
                                      <UserAvatar user={u} size="sm" />
                                    </div>
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* History */}
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        History ({blockerForm.history.length})
                      </label>
                      <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-2 bg-gray-50 dark:bg-gray-800">
                        {blockerForm.history.map((h, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex justify-between gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 w-full">
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                {h.comment}
                              </p>

                              {h.Meeting_Link && (
                                <a href={h.Meeting_Link} target="blank">
                                  <ExternalLink className=" h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Panel - Properties */}
            <div className="w-80 border-l bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Properties
              </h3>

              {/* Story Points */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Story Points
                </label>
                <Input
                  value={points}
                  onChange={(e) => handlePointsChange(e.target.value)}
                  type="number"
                  className="w-full"
                  min="0"
                  max="100"
                />
              </div>

              {/* Epic */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Epic
                </label>
                <Badge
                  variant="secondary"
                  className="w-full justify-center py-1"
                >
                  {issue.epic}
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Info
                </h4>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Priority
                    </span>
                    <Badge className={`text-xs ${getPriorityColor(priority)}`}>
                      {priority}
                    </Badge>
                  </div>

                  {/* Blocker Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Blocker Status
                    </span>
                    <Badge
                      className={`text-xs flex items-center gap-1 ${blockerStatus.color}`}
                    >
                      {blockerStatus.icon}
                      {blockerStatus.label}
                    </Badge>
                  </div>

                  {blockerForm.responsible.length > 0 && (
                    <div className="pt-2 border-t">
                      <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                        Responsible ({blockerForm.responsible.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {blockerForm.responsible.slice(0, 3).map((person) => (
                          <UserAvatar key={person.id} user={person} size="xs" />
                        ))}
                        {blockerForm.responsible.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs font-medium">
                              +{blockerForm.responsible.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {canChange && (
                  <Button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    variant="destructive"
                    className="w-full"
                    size="sm"
                  >
                    {deleteLoading ? "Deleting..." : "Delete Issue"}
                  </Button>
                )}

                {(deleteError || updateError) && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {deleteError?.message || updateError?.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
