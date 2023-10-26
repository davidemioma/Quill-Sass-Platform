"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import UploadDropzone from "./UploadDropzone";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  isSubscribed: boolean;
}

const UploadBtn = ({ isSubscribed }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadBtn;
