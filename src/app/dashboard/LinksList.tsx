"use client";
import React from "react";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import prisma from "@/utils/prisma";

import { handleDelete } from "@/app/actions/links"; 

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LinksList() {
    const session = useSession();

    const { data, error, isLoading } = useSWR("/api/links", session ? fetcher : null);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading links</p>;
    }

    return (
        <ul>
            {data.map((link: any) => (
                <li key={link.id}>
                    <span>
                        <a href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
                        <a href={`/dashboard/edit/${link.id}`}>Edit</a>
                        <button onClick={() => {
                            if(confirm("Are you sure you want to delete this link?")) {
                                try {
                                    handleDelete(link.id)
                                    mutate("/dashboard");
                                }
                                catch(err) {
                                    console.log(err)
                                }
                            }

                        }}>Delete</button>
                    </span>
                </li>
            ))}
        </ul>
    )
}