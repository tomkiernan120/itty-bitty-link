"use client";

import { useFormStatus } from "react-dom";
import Button from "../Button/primary";

interface SubmitProps {
    children: React.ReactNode;
}

export function SubmitButton({ children }: SubmitProps) {
    const { pending } = useFormStatus();

    return <Button type="submit" variant="primary" label={children} loading={pending} disabled={pending} />;
}