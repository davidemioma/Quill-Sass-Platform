"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import UploadDropzone from "./UploadDropzone";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const UploadBtn = () => {
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
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadBtn;
