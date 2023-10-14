"use client";

import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { trpc } from "@/lib/_trpcClient";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { Progress } from "@/components/ui/progress";
import { Cloud, File, Loader2 } from "lucide-react";

const UploadDropzone = () => {
  const router = useRouter();

  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload } = useUploadThing("freePlanUploader");

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const inteval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(inteval);

          return prev;
        }

        return prev + 5;
      });
    }, 500);

    return inteval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        //Handle file uploading
        const res = await startUpload(acceptedFile);

        if (!res) {
          return toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        }

        const [fileResponse] = res;

        const key = fileResponse?.key;

        if (!key) {
          return toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        }

        clearInterval(progressInterval);

        setUploadProgress(100);

        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="h-64 m-4 border border-dashed border-gray-300 rounded-lg"
        >
          <div className="w-full h-full flex items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="bg-gray-50 w-full h-full flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />

                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>

                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="bg-white max-w-sm flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="h-full grid place-items-center px-3 py-2">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>

                  <div className="h-full px-3 py-2 text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading && (
                <div className="w-full max-w-xs mx-auto mt-4">
                  <Progress
                    className="h-1 w-full bg-zinc-200"
                    value={uploadProgress}
                  />

                  {uploadProgress === 100 && (
                    <div className="flex items-center justify-center gap-1 pt-2 text-sm text-zinc-700 text-center">
                      <Loader2 className="h-3 w-3 animate-spin" />

                      <span>Redirecting...</span>
                    </div>
                  )}
                </div>
              )}

              <input
                {...getInputProps()}
                className="hidden"
                type="file"
                id="dropzone-file"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadDropzone;
