"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import UploadBtn from "./UploadBtn";
import { Button } from "./ui/button";
import { trpc } from "@/lib/_trpcClient";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { Ghost, Loader2, MessageSquare, Plus, TrashIcon } from "lucide-react";

const Dashboard = () => {
  const router = useRouter();

  const utils = trpc.useContext();

  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate(); //Make it refetch the getUserFiles endpoint.

      router.refresh();
    },
    onMutate: ({ fileId }) => {
      setDeletingFileId(fileId);
    },
    onSettled: () => {
      setDeletingFileId(null);
    },
  });

  return (
    <main className="max-w-7xl mx-auto mt-14 md:p-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pt-8 pb-5 border-b border-gray-200">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>

        <UploadBtn />
      </div>

      {files && files?.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 divide-y divide-zinc-200">
          {files.map((file) => (
            <li
              key={file.id}
              className="bg-white col-span-1 divide-y divide-gray-200 rounded-lg shadow transition hover:shadow-lg"
            >
              <Link
                href={`/dashboard/${file.id}`}
                className="flex flex-col gap-2"
              >
                <div className="w-full flex items-center justify-between gap-6 pt-6 px-6">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-10 w-10 flex-shrink-0 rounded-full" />

                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg text-zinc-900 font-medium truncate">
                        {file.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="grid grid-cols-3 place-items-center gap-6 py-2 px-6 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />

                  <span>{format(new Date(file.createdAt), "MMM yyyy")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />

                  <span>mocked</span>
                </div>

                <Button
                  className="w-full"
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteFile({ fileId: file.id })}
                >
                  {deletingFileId === file.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <TrashIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : isLoading ? (
        <Skeleton className="my-2" height={100} count={3} />
      ) : (
        <div className="flex flex-col items-center gap-2 mt-16">
          <Ghost className="h-8 w-8 text-zinc-800" />

          <h3 className="text-xl font-semibold">Pretty empty around here</h3>

          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
