"use client";

import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircleIcon, TrophyIcon, AlertCircle } from "lucide-react";
import { getEpicsForProject, createEpic } from "@/actions/epics";
import MDEditor from "@uiw/react-md-editor";
import useFetch from "@/hooks/use-fetch";
import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organizations";
import { issueSchema } from "@/app/lib/validators";

export default function IssueCreationDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) {
  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUsers);

  const {
    loading: epicsLoading,
    fn: fetchEpics,
    data: epics,
  } = useFetch(getEpicsForProject);

  const { loading: createEpicLoading, fn: createEpicFn } = useFetch(createEpic);

  const [newEpic, setNewEpic] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
      points: 0,
      epic: "",
    },
  });
  useEffect(() => {
    if (isOpen) {
    } else {
      document.body.style.overflow = "auto";
    }

    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsers(orgId);
      fetchEpics(projectId);
    }
  }, [isOpen, orgId, projectId]);

  const onSubmit = async (data) => {
    await createIssueFn(projectId, {
      ...data,
      points: parseInt(data.points, 10), // <-- Convert points to an integer
      status,
      sprintId,
    });
  };
  const onOpen = () => {
    setIsModalOpen(true);
  };

  const handleCreate = async (item) => {
    try {
      await createEpic(projectId, item);
      setNewEpic("");
      fetchEpics(projectId);
      setNewItem("");
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (newIssue) {
      reset();
      onClose();
      onIssueCreated();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newIssue, createIssueLoading]);

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="bg-slate-800">
        <DrawerHeader>
          <DrawerTitle>Create New Issue</DrawerTitle>
        </DrawerHeader>
        {usersLoading && <BarLoader width={"100%"} color="#36d7b7" />}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              className="border-slate-100"
              id="title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MDEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="flex justify-around p-2">
            {" "}
            <div>
              <label
                htmlFor="assigneeId"
                className="block text-sm font-medium mb-1"
              >
                Assignee
              </label>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.assigneeId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.assigneeId.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium mb-1"
              >
                Priority
              </label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <label
                htmlFor="points"
                className="block text-sm font-medium mb-1"
              >
                Points
              </label>
              <Input id="points" {...register("points")} type="number" />
              {errors.points && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.points.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="Epic" className="block text-sm font-medium mb-1">
                Epic
              </label>
              <Controller
                name="epic"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Epic" />
                    </SelectTrigger>
                    <SelectContent>
                      {epics?.map((epic) => (
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
                )}
              />
            </div>
          </div>
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

          {error && <p className="text-red-500 mt-2">{error.message}</p>}
          <Button
            type="submit"
            disabled={createIssueLoading}
            className="w-full"
          >
            {createIssueLoading ? "Creating..." : "Create Issue"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
