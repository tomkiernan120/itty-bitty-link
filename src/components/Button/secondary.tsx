"use client";

import Link from "next/link";
import React from "react";

interface ButtonProps {
    label: string | React.ReactNode;
    type?: 'button' | 'submit' | 'reset' | 'link';
    href?: string;
    loading?: boolean;
    onClick?: () => void;
}

export default function Button({ label, type = 'button', loading = false, onClick, href }: ButtonProps) {
    if(type == 'link' && href) {
        return (
            <Link href={href} className="bg-white border border-lime-700 text-gray-600 rounded-3xl py-2 px-7 font-sans hover:bg-lime-500 hover:text-white">
                {label}
            </Link>
        )
    }


    return (
        <button className="bg-white border border-lime-700 text-gray-600 rounded-3xl py-2 px-7 font-sans hover:bg-lime-500 hover:text-white" type={type} onClick={onClick}>
            {label}
        </button>
    )
}