"use client";

import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

export default function CopyLink({ alias }: { alias: string }) {
    const [showCopied, setShowCopied] = useState<boolean>(false);
    const [baseUrl, setBaseUrl] = useState<string>("");

    // Set baseUrl only on client-side to avoid hydration issues
    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    const link = `${baseUrl}/r/${alias}`;

    return (
        <span className="flex flex-row space-x-2 bg-gray-100 p-1 rounded-lg items-center justify-center text-slate-700">
            <code>{alias}</code>

            <div className="relative">
                {showCopied && <div className="absolute bg-slate-700 text-white text-sm rounded-lg p-1 -top-8 left-1/2 -translate-x-1/2 ">
                    Copied
                </div>}

                <FontAwesomeIcon className="cursor-pointer w-4 h-4" fixedWidth onClick={() => {
                    setShowCopied(true);
                    setTimeout(() => setShowCopied(false), 2000);
                    navigator.clipboard.writeText(link);
                }} icon={faCopy} /> 
            </div>
        </span>
    )
}