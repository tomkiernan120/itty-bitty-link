"use client";

import React from 'react';

import Secondary from './secondary';
import Link from 'next/link';

interface ButtonProps {
    label: string | React.ReactNode;
    type?: 'button' | 'submit' | 'reset' | 'link';
    href?: string;
    variant: 'primary' | 'secondary';
    onClick?: () => void;
    loading?: boolean;
}

export default function Button({ label, type = 'button', variant = 'primary', onClick, loading = false, href }: ButtonProps) {
    if(variant === 'secondary') {
        return <Secondary label={label} type={type} onClick={onClick} href={href} />;
    }

    if(type == 'link' && href) {
        return (
            <Link className="text-white bg-darkgreen-500 rounded-3xl py-2 px-7 font-sans hover:bg-darkgreen-800 hover:drop-shadow active:shadow-inner disabled:bg-[#B0CFD0] disabled:text-[#ABABAB] disabled:border-[rgba(78, 99, 100, 0.28)]" type={type} href={href}>
                {label}
            </Link>
        )
    }
    
    return (
        <button className="text-white bg-darkgreen-500 rounded-3xl py-2 px-7 font-sans hover:bg-darkgreen-800 hover:drop-shadow-md active:shadow-inner disabled:bg-[#B0CFD0] disabled:text-[#ABABAB] disabled:border-[rgba(78, 99, 100, 0.28)]" type={type} onClick={onClick} >
        {label}
      </button>
    );   
}