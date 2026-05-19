"use client";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
    label: string | React.ReactNode;
    type?: 'button' | 'submit' | 'reset' | 'link';
    href?: string;
    loading?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    size?: "small" | "large" | "normal";
    className?: string;
}

export default function Button({ label, type = 'button', loading = false, onClick, href, disabled, size = "normal", className }: ButtonProps) {
    if(type == 'link' && href) {
        return <Link href={href} className={twMerge("bg-white text-sm md:text-base border border-lime-700 text-gray-600 rounded-3xl py-1 md:py-2 px-4 md:px-7 font-sans hover:bg-lime-500 hover:text-white flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-700 transition-all", size === "small" && "text-sm py-1 px-5", size === "large" && "text-xl py-3 px-8", className )}>
            {loading && <FontAwesomeIcon className="w-4 h-4" fixedWidth icon={faSpinner} spinPulse />}
            {!loading && label}
          </Link>;
    }

    // @ts-ignore
    return <button className={twMerge("bg-white text-sm md:text-base border border-lime-700 text-gray-600 rounded-3xl py-1 md:py-2 px-4 md:px-7 font-sans hover:bg-lime-500 hover:text-white flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-700 transition-all", size === "small" && "text-sm py-1 px-5", size === "large" && "text-xl py-3 px-8", className )} disabled={disabled} type={type} onClick={onClick}>
        {loading && <FontAwesomeIcon className="w-4 h-4" fixedWidth icon={faSpinner} spinPulse />}
        {!loading && label}
      </button>;
}