"use client";

import { useFormState } from "react-dom";
import Input from "@/components/Forms/Input";
import { SubmitButton } from "@/components/Forms/SubmitButton";
import type { LinkFormState } from "@/app/actions/links";

interface LinkFormProps {
    action: (prevState: LinkFormState, formData: FormData) => Promise<LinkFormState>;
    heading: string;
    submitLabel: string;
    hint?: string;
    link?: {
        id: string;
        title: string;
        url: string;
    };
}

export default function LinkForm({ action, heading, submitLabel, hint, link }: LinkFormProps) {
    const [state, formAction] = useFormState(action, {});

    return (
        <form className="border rounded-lg bg-white flex flex-col space-y-8 px-8 py-6 drop-shadow w-full md:w-96" action={formAction}>
            <div>
                <h3 className="text-lg text-slate-700 font-bold mb-2">{heading}</h3>
                {hint && <p className="text-xs text-slate-500">{hint}</p>}
            </div>

            {state.errors?.form && (
                <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {state.errors.form[0]}
                </div>
            )}

            {link && <input type="hidden" name="id" value={link.id} />}

            <Input type="text" label="Title" name="title" required defaultValue={link?.title} error={state.errors?.title?.[0]} />

            <Input type="url" label="URL" name="url" required defaultValue={link?.url} error={state.errors?.url?.[0]} />

            <SubmitButton>{submitLabel}</SubmitButton>
        </form>
    );
}
