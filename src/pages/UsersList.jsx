import { useEffect, useState } from "react";
import { usersApi } from "../service/user";
import { Link } from "react-router-dom";


function Th({ children, width }) {
    return (
        <th
            style={width ? { width } : undefined}
            className="whitespace-nowrap border-b border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600"
        >
            {children}
        </th>
    );
}
function Td({ children, className = "", ...rest }) {
    return (
        <td className={`px-4 py-3 align-top text-gray-800 ${className}`} {...rest}>
            {children}
        </td>
    );
}

export default function UsersList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState([]);
    const [busyId, setBusyId] = useState(null);
    const [err, setErr] = useState("");

    const load = async () => {
        setLoading(true);
        setErr("");
        try {
            const data = await usersApi.list(8);
            setRows(data);
        } catch {
            setErr("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const onDelete = async (row) => {
        if (!confirm(`Delete "${row.name}"?`)) return;
        try {
            setBusyId(row.id);
            await usersApi.remove(row.id);
            setRows((prev) => prev.filter((r) => r.id !== row.id));
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="mx-auto max-w-6xl p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Users</h1>
                    <p className="text-sm text-gray-600">List page</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={load}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-60"
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                    <Link
                        to="/users/new"
                        className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-black"
                    >
                        + New User
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                            <Th>Username</Th>
                            <Th>Email</Th>
                            <Th width="220">Action</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <Td>{u.id}</Td>
                                <Td>{u.name}</Td>
                                <Td>{u.username}</Td>
                                <Td>
                                    <a className="text-blue-600 underline underline-offset-2" href={`mailto:${u.email}`}>
                                        {u.email}
                                    </a>
                                </Td>
                                <Td>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/users/${u.id}/edit`}
                                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => onDelete(u)}
                                            disabled={busyId === u.id}
                                            className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black disabled:opacity-60"
                                        >
                                            {busyId === u.id ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </Td>
                            </tr>
                        ))}

                        {!loading && rows.length === 0 && (
                            <tr>
                                <Td colSpan={5} className="text-center text-gray-500">
                                    No data.
                                </Td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
