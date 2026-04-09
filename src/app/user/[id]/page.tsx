"use client";

import { useParams, useRouter } from "next/navigation";
import { GlobalNav } from "@/components/global-nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle } from "lucide-react";

export default function UserHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <GlobalNav activeTab="Home" />

      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 gap-1.5 text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          User History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          User ID: {userId}
        </p>

        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <UserCircle className="mb-4 size-12 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold text-foreground">
            Under Construction
          </h2>
          <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
            The user history page is not yet available. Check back later for
            detailed reporting activity, contribution history, and account
            details.
          </p>
        </div>
      </div>
    </div>
  );
}
