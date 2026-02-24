"use client";
import { Task } from "@prisma/client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Form from "../form";

type Props = {
  task: Task;
};
export default function TitleCell({ task }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <span
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:underline"
      >
        {task.title}
      </span>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <Form task={task} onSubmitOrDelete={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
