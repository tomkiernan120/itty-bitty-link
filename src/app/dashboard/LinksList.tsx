"use client";
import React from "react";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { handleDelete } from "@/app/actions/links"; 
import Button from "@/components/Button/primary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LinksList() {
    const session = useSession();

    const { data, error, isLoading } = useSWR("/api/links", session ? fetcher : null);

    return (
        <div className="flex flex-col">
            <div className="flex flex-row mb-8 justify-end space-x-2">
                <Button type="link" href="/dashboard/create" variant="primary" label={<>Create <FontAwesomeIcon icon={faPlus} /></>} />
            </div>

            <div className="flex bg-white border border-gray-200 drop-shadow p-4 rounded-lg">

                <table className="table-auto w-full">
                    <thead className=" table-header-group border-b">
                        <tr>
                            <th className="table-cell text-left px-2 pb-2"><input type="checkbox" /></th>
                            <th className="table-cell text-left px-2 pb-2">Title</th>
                            <th className="table-cell text-left px-2 pb-2">URL</th>
                            <th className="table-cell text-left px-2 pb-2">Created</th>
                            <th className="table-cell text-left px-2 pb-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.length === 0 && error (
                            <tr>
                                <td className="table-cell text-left px-2 py-2" colSpan={5}>Uh, Oh! There was an error!</td>
                            </tr>
                        
                        )}
                        {data?.length === 0 && isLoading (
                            <tr>
                                <td className="table-cell text-left px-2 py-2" colSpan={5}>
                                    <FontAwesomeIcon icon={faSpinner} spinPulse />
                                </td>
                            </tr>
                        
                        )}
                        {data?.map((link: any) => (
                            <tr key={link.id}>
                                <td className="table-cell text-left px-2 py-2"><input type="checkbox" /></td>
                                <td className="table-cell text-left px-2 py-2">{link.title}</td>
                                <td className="table-cell text-left px-2 py-2">{link.url}</td>
                                <td className="table-cell text-left px-2 py-2">{new Date(link.createdAt).toLocaleDateString()}</td>
                                <td className="table-cell text-left px-2 py-2">
                                    <div className="flex space-x-2">
                                        <Button type="link" href={`/dashboard/update/${link.id}`} variant="primary" label="Edit" />
                                        <Button type="button" onClick={async () => {
                                            await handleDelete(link.id);
                                            mutate("/api/links");
                                        }} variant="secondary" label="Delete" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}