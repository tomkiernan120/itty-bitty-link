"use client";

import React, { useState } from "react";
import { handleCreate } from "@/app/actions/links";
import Input from "@/components/Forms/Input";
import Button from "@/components/Button/primary";

export default function Page() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [linkCount, setLinkCount] = useState(0);

  React.useEffect(() => {
    const fetchLinkCount = async () => {
      const response = await fetch("/api/links");
      const data = await response.json();
      if (data.success) {
        setLinkCount(data.count || 0);
      }
    };
    fetchLinkCount();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setIsPending(true);

    try {
      const result = await handleCreate(formData);

      if (!result.success) {
        setError(result.error);
        setIsPending(false);
        return;
      }
      // If successful, will redirect automatically
    } catch (err: any) {
      // Let NEXT_REDIRECT propagate
      if (err?.digest) {
        throw err;
      }
      setError("An unexpected error occurred");
      setIsPending(false);
    }
  };

  const isAtLimit = linkCount >= 5;

  if (isAtLimit) {
    return <main className="flex items-center justify-center py-10">
      <div className="border rounded-lg bg-white flex flex-col space-y-6 px-8 py-6 drop-shadow w-full md:w-96">
        <h3 className="text-lg text-slate-700 font-bold mb-2">Link Limit Reached</h3>
        <p className="text-slate-600 text-sm">
          You have reached the maximum of <span className="font-semibold">5 links</span>.
          To create a new link, you must delete one of your existing links first.
        </p>
        <Button type="link" href="/dashboard" variant="primary" label="Back to Dashboard" />
      </div>
    </main>;
  }

  return <main className="flex items-center justify-center py-10">
    <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:w-96" action={handleSubmit}>
      <div>
        <h3 className="text-lg text-slate-700 font-bold mb-2">Create Link</h3>
        <p className="text-xs text-slate-500">{linkCount}/5 links</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input type="text" label="Title" name="title" required disabled={isPending} />

      <Input type="url" required label="URL" name="url" disabled={isPending} />

      <Button label={isPending ? "Creating..." : "Create"} variant="primary" type="submit" loading={isPending} disabled={isPending} />
    </form>
  </main>;
}
