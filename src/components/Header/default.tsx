"use client";

import React from 'react';
import Logo from '../Logo';
import Button from '../Button/primary';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Header () {
    const { data, status } = useSession();

    return (
        <header className='w-full h-auto min-h-16'>
            <div className="container px-8 md:px-0 md:mx-auto flex justify-between items-center py-4">
                <Link href="/">
                    <Logo />
                </Link>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    {status === 'authenticated' ? (
                        <>
                            <Button label="Dashboard" type="link" variant="primary" href={'/dashboard'} />
                            <Button label="Log out" type="button" variant="secondary" onClick={async () => {
                                signOut();
                            }} />
                        </>
                    ) : (
                        <>
                            <Link href="/login">Login</Link>
                            <Button label="Sign Up" type="link" variant="primary" href={'/register'} />
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}