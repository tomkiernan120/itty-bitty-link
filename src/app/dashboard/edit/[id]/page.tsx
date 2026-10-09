"use client";

import React, { useState } from 'react';
import { handleUpdate } from '@/app/actions/links';
import Input from '@/components/Forms/Input';
import Button from '@/components/Button/primary';
import { useParams } from 'next/navigation';

export default function Page() {
    const params = useParams();
    const id = params?.id as string;

    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [link, setLink] = useState<{ title: string; url: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchLink = async () => {
            try {
                const response = await fetch(`/api/links/${id}`);
                const data = await response.json();
                if (data.success && data.link) {
                    setLink(data.link);
                } else {
                    setError("Link not found");
                }
            } catch (err) {
                setError("Failed to load link");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchLink();
        }
    }, [id]);

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        setIsPending(true);

        try {
            const result = await handleUpdate(formData);

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

    if (isLoading) {
        return <main className="flex items-center justify-center py-10">
            <div className="text-slate-600">Loading...</div>
        </main>;
    }

    if (!link) {
        return <main className="flex items-center justify-center py-10">
            <div className="border rounded-lg bg-white flex flex-col space-y-6 px-8 py-6 drop-shadow w-full md:w-96">
                <h3 className="text-lg text-slate-700 font-bold mb-2">Link Not Found</h3>
                <Button type="link" href="/dashboard" variant="primary" label="Back to Dashboard" />
            </div>
        </main>;
    }

    return <main className="flex items-center justify-center py-10">
        <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:w-96" action={handleSubmit}>
            <h3 className="text-lg text-slate-700 font-bold mb-2">Edit Link</h3>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <input type="hidden" name="id" value={id} />

            <Input type="text" label="Title" name="title" required defaultValue={link.title} disabled={isPending} />

            <Input type="url" required label="URL" name="url" defaultValue={link.url} disabled={isPending} />

            <Button type="submit" variant="primary" label={isPending ? "Updating..." : "Update"} loading={isPending} disabled={isPending} />
        </form>
    </main>;
}