import { trpc } from "@/lib/_trpcClient";
import { useRouter, useSearchParams } from "next/navigation";

export default async function AuthCallback() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");

  const { data, isLoading } = await trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        router.push(origin ? `${origin}` : "/dashboard");
      }
    },
  });

  return <div>AuthCallback</div>;
}
