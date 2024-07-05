"use client";

import React from 'react';

import Secondary from './secondary';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface ButtonProps {
    label: string | React.ReactNode;
    type?: 'button' | 'submit' | 'reset' | 'link';
    href?: string;
    variant: 'primary' | 'secondary';
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    size?: "normal" | "small" | "large";
    className?: string;
}

export default function Button({ label, type = 'button', variant = 'primary', onClick, loading = false, href, disabled, size = "normal", className }: ButtonProps) {
    if(variant === 'secondary') {
        return <Secondary label={label} type={type} onClick={onClick} href={href} size={size} loading={loading} disabled={disabled} className={className} />;
    }

    if(type == 'link' && href) {
        return <Link className={twMerge("text-white text-sm md:text-base bg-darkgreen-500 rounded-3xl py-1 md:py-2 px-4 md:px-7 font-sans hover:bg-darkgreen-800 hover:drop-shadow active:shadow-inner disabled:bg-[#B0CFD0] disabled:text-[#ABABAB] disabled:border-[rgba(78, 99, 100, 0.28)] flex justify-center items-center text-center", size === "small" && "text-sm py-1 px-5", size === "large" && "text-xl py-3 px-8", className )} disabled={disabled} type={type} href={href}>
            {loading && <FontAwesomeIcon icon={faSpinner} spinPulse />}
            {!loading && label}
          </Link>;
    }
    
    return <button className={twMerge("text-white text-sm md:text-base bg-darkgreen-500 rounded-3xl py-1 md:py-2 px-4 md:px-7 font-sans hover:bg-darkgreen-800 hover:drop-shadow active:shadow-inner disabled:bg-[#B0CFD0] disabled:text-[#ABABAB] disabled:border-[rgba(78, 99, 100, 0.28)] flex justify-center items-center text-center", size === "small" && "text-sm py-1 px-5", size === "large" && "text-xl py-3 px-8", className)} type={type} disabled={disabled} onClick={onClick}>
        {loading && <FontAwesomeIcon icon={faSpinner} spinPulse />}
        {!loading && label}
      </button>;   
}