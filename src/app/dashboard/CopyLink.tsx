"use client";

import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function CopyLink({ alias }: { alias: string }) {
    const [showCopied, setShowCopied] = useState<boolean>(false);
    const link = `http://localhost:3000/r/${alias}`

    return (
        <span className="flex flex-row space-x-2 bg-gray-100 p-1 rounded-lg items-center justify-center text-slate-700">
            <code>{alias}</code>

            <div className="relative">
                {showCopied && <div className="absolute bg-slate-700 text-white text-sm rounded-lg p-1 -top-8 left-1/2 -translate-x-1/2 ">
                    Copied
                </div>}

                <FontAwesomeIcon className="cursor-pointer" onClick={() => {
                    setShowCopied(true);
                    setTimeout(() => setShowCopied(false), 2000);
                    navigator.clipboard.writeText(link);
                }} icon={faCopy} /> 
            </div>
        </span>
    )
}