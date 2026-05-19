"use client";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { handleDelete } from "@/app/actions/links"; 
import Button from "@/components/Button/primary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@prisma/client";
import CopyLink from "./CopyLink";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LinksList() {
    const session = useSession();

    const [pageIndex, setPageIndex] = useState<number>(1);
    const [selected, setSelected] = useState<string[]>([]);

    const selectAll = () => {
        if(selected?.length === data?.links?.length) {
            setSelected([]);
        }
        else {
            setSelected(data?.links?.map((link: Link) => link.id));
        }
    }

    const { data, error, isLoading } = useSWR(`/api/links?page=${pageIndex}`, session ? fetcher : null);

    const isAtLimit = data?.total >= 5;

    return (
        <div className="flex flex-col">
            {data?.total !== undefined && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-slate-700">
                        <span className="font-semibold">{data.total}/5</span> links created
                        {isAtLimit && <span className="text-orange-600 font-semibold ml-2">• Limit reached</span>}
                    </p>
                </div>
            )}
            <div className="flex flex-row mb-8 justify-end space-x-2">
                {selected?.length > 0 && (
                    <Button type="button" label={`Delete (${selected?.length})`} variant="primary" onClick={() => {

                        const handle = async () => {
                            if(confirm(`Are you sure you want to delete ${selected?.length} links?`)) {
                                selected.forEach(async (id) => {
                                    await handleDelete(id);
                                });
    
                                setSelected([]);
                                mutate("/api/links");
                            }
                        }

                        handle().catch((e) => console.error(e));
                    }} />
                )}

                <Button
                    type="link"
                    href={isAtLimit ? "#" : "/dashboard/create"}
                    variant={isAtLimit ? "secondary" : "primary"}
                    disabled={isAtLimit}
                    label={<span className="flex justify-center items-center space-x-2"><span>{isAtLimit ? "Limit Reached (5/5)" : "Create"}</span> {!isAtLimit && <FontAwesomeIcon className="w-4 h-4" fixedWidth icon={faPlus} />}</span>}
                    title={isAtLimit ? "You have reached the maximum of 5 links. Delete a link to create a new one." : "Create a new link"}
                />
            </div>

            <div className="flex bg-white border border-gray-200 drop-shadow py-4 rounded-lg mb-8">
                <table className="table-auto w-full">
                    <thead className="hidden md:table-header-group border-b">
                        <tr className="flex flex-col md:table-row mb-8 md:mb-0">
                            <th className="table-cell text-left px-2 pb-2"><input type="checkbox" checked={(selected?.length === data?.links?.length && selected?.length) ? true : false} onChange={() => selectAll()} /></th>
                            <th className="table-cell text-left px-2 pb-2">Title</th>
                            <th className="table-cell text-left px-2 pb-2">URL</th>
                            <th className="table-cell text-left px-2 pb-2">Alias</th>
                            <th className="table-cell text-left px-2 pb-2">Created</th>
                            <th className="table-cell text-left px-2 pb-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.links?.length === 0 && error && (
                            <tr>
                                <td className="table-cell text-left px-2 py-2" colSpan={5}>Uh, Oh! There was an error!</td>
                            </tr>
                        
                        )}
                        {data?.links?.length === 0 && isLoading && (
                            <tr>
                                <td className="table-cell text-left px-2 py-2" colSpan={5}>
                                    <div className="flex justify-center py-2 pt-4">
                                        <FontAwesomeIcon className="w-6 h-6" icon={faSpinner} spinPulse />
                                    </div>
                                </td>
                            </tr>
                        
                        )}
                        {data?.links?.map((link: Link) => (
                            <tr key={link.id} className="odd:bg-green-300/5 flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b pb-4 md:pb-0">
                                <td className="table-cell text-left px-2 py-2"><input type="checkbox" checked={selected?.includes(link.id)} onChange={() => {
                                    if(selected?.includes(link.id)) {
                                        setSelected(selected.filter((id) => id !== link.id));
                                    }
                                    else {
                                        setSelected([...selected, link.id]);
                                    }
                                }} /></td>
                                <td className="table-cell text-left px-2 py-2 text-sm before:content-['Title:'] before:md:content-none before:font-bold before:mr-2 before:text-slate-600">{link.title}</td>
                                <td className="table-cell text-left px-2 py-2 text-sm break-words before:content-['URL:'] before:md:content-none before:font-bold before:mr-2 before:text-slate-600">{link.url}</td>
                                <td className="table-cell text-left px-2 py-2 text-sm break-words before:content-['Alias:'] before:md:content-none before:font-bold before:mr-2 before:text-slate-600">
                                    <CopyLink alias={(link as any).linkAlias?.alias || ""} />
                                </td>
                                <td className="table-cell text-left px-2 py-2 text-sm before:content-['Created:'] before:md:content-none before:font-bold before:mr-2 before:text-slate-600">{new Date(link.createdAt).toLocaleDateString()}</td>
                                <td className="table-cell text-left px-2 py-2">
                                    <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-end md:justify-start md:space-x-2 before:content-['Actions:'] before:md:content-none before:font-bold before:text-slate-600 before:mb-2">
                                        <Button type="link" href={`/dashboard/edit/${link.id}`} size="small" variant="primary" label="Edit" />
                                        <Button type="button" onClick={async () => {
                                            if(confirm("Are you sure you want to delete this link?")) {
                                                await handleDelete(link.id);
                                                mutate("/api/links");
                                            }
                                        }} variant="secondary" size="small" label="Delete" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-row space-x-2">
                {data?.pages > 1 && (
                    <>
                        <Button type="button" disabled={pageIndex <= 1} onClick={() => setPageIndex(pageIndex - 1)} variant="primary" label="Previous" />
                        
                            <div className="flex flex-row space-x-2">
                                {[...Array(data.pages).keys()].map((page) => (
                                    <Button key={page} type="button" onClick={() => setPageIndex(page)} variant="secondary" label={page + 1} />
                                ))}
                            </div>

                        <Button type="button" onClick={() => setPageIndex(pageIndex + 1)} variant="primary" label="Next" disabled={pageIndex >= data?.pages} />
                    </>
                )}
            </div>
        </div>
    )
}