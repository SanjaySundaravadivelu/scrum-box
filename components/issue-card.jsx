"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import IssueDetailsDialog from "./issue-details-dialog";
import UserAvatar from "./user-avatar";
import { useRouter } from "next/navigation";

const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

export default function IssueCard({
  issue,
  blockers = [],
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
  onBlockerCreate = () => {},
  onBlockerUpdate = () => {},
  onBlockerDelete = () => {},
}) {
  useEffect(() => {
    console.log("Blockers", blockers);
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currBlocker, setCurrBlocker] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // since blocker.id === issue.id, just find one
    if (blockers && blockers.length > 0) {
      const found = blockers.find((b) => b.id === issue.id) || null;
      setCurrBlocker(found);
    }
  }, [blockers, issue.id]);

  const onDeleteHandler = (...params) => {
    router.refresh();
    onDelete(...params);
    onBlockerDelete(issue.id);
  };

  const onUpdateHandler = (...params) => {
    router.refresh();
    onUpdate(...params);
  };

  const handleBlockerUpdate = (...params) => {
    router.refresh();
    onBlockerUpdate(...params);
  };

  const handleBlockerCreate = (...params) => {
    router.refresh();
    onBlockerCreate(...params);
  };

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader
          className={`border-t-2 ${priorityColor[issue.priority]} rounded-lg`}
        >
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex justify-between gap-2 mt-3">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant="outline" className="-ml-1">
            {issue.priority}
          </Badge>
          <Badge variant="outline" className="-ml-1">
            {issue.points}
          </Badge>
        </CardContent>

        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee} />
          <div className="text-xs text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority]}
          blocker={currBlocker}
          BlockerCreate={handleBlockerCreate}
          BlockerUpdate={handleBlockerUpdate}
        />
      )}
    </>
  );
}
