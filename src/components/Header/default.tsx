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
            <div className="lg:container px-8 lg:px-0 lg:mx-auto flex justify-between items-center py-4">
                <Link href="/">
                    <Logo />
                </Link>

                <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row items-end md:justify-between space-x-1 lg:space-x-4 md:items-center">
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