"use client";

import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/_trpcClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        router.push(origin ? `${origin}` : "/dashboard");
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="w-full flex justify-center mt-32">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 text-zinc-800 animate-spin" />

        <h3 className="text-xl font-semibold">Setting up your account...</h3>

        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
}
