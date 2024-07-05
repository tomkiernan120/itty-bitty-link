"use client";

import React from 'react';
import Logo from '../Logo';
import Button from '../Button/primary';
import Link from 'next/link';
import { auth } from '@/app/auth';
import { signOut, useSession } from 'next-auth/react';

export default function Header () {
    const session = useSession();

    return (
        <header className='w-full h-auto min-h-16'>
            <div className="container mx-auto flex justify-between items-center py-4">
                <Link href="/">
                    <Logo />
                </Link>

                <div className="flex justify-between space-x-4 items-center">
                    {session ? (
                        <>
                            <Button label="Dashboard" type="link" variant="primary" href={'/dashboard'} />
                            <Button label="Log out" type="button" variant="secondary" onClick={async () => {
                                signOut();
                            }} />
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-gray-600 font-sans text-lg font-bold hover:text-lime-500">Login</Link>
                            <Button label="Sign Up" type="link" variant="primary" href={'/register'} />
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}