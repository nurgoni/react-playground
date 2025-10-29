import { useEffect, useState, useMemo } from "react";
import { usersApi } from "./service/user";


/* Small helpers to keep table cells consistent */
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

export default function App() {
    // table rows
    const [rows, setRows] = useState([]);

    // form state
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [editingId, setEditingId] = useState(null);

    // ui states
    const [loading, setLoading] = useState(false);
    const [busyId, setBusyId] = useState(null);
    const [err, setErr] = useState("");

    const isEditing = useMemo(() => editingId !== null, [editingId]);

    // Load get
    useEffect(() => {
        (async () => {
            setLoading(true);
            setErr("");
            try {
                const data = await usersApi.list(8);
                setRows(data);
            } catch (e) {
                setErr("Failed to fetch users.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // helpers
    const resetForm = () => {
        setName("");
        setUsername("");
        setEmail("");
        setEditingId(null);
    };

    // create or update
    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");

        // simple validation
        if (!name.trim()) return setErr("Name is required");
        if (!username.trim()) return setErr("Username is required");
        if (!email.trim() || !email.includes("@")) return setErr("Valid email is required");

        try {
            if (!isEditing) {
                // create
                setLoading(true);
                const created = await usersApi.create({
                    name,
                    username,
                    email
                });
                setRows(prev => [{...created}, ...prev]);
                resetForm();
            } else {
                // update
                setBusyId(editingId);
                const updated = await usersApi.update(
                    editingId,
                    {id: editingId, name, username, email}
                );
                setRows(prev => prev.map(r => (r.id === editingId ? updated : r)));
                resetForm();
            }
        } catch(e) {
            setErr(isEditing ? "Failed to update user." : "Failed to create user.");
            console.error(e);
        } finally {
            setLoading(false);
            setBusyId(null);
        }
    };

    // edit -> repopulate form
    const onEdit = (row) => {
        setName(row.name ?? "");
        setUsername(row.username ?? "");
        setEmail(row.email ?? "");
        setEditingId(row.id);
        setErr();
    };

    // delete
    const onDelete = async (row) => {
       const ok = confirm(`Delete "${row.name}"?`);
       if (!ok) return;
       try {
          setBusyId(row.id);
          await usersApi.remove(row.id);
          setRows(prev => prev.filter(r => r.id !== row.id));
          if (editingId === row.id) resetForm();
       } catch (e) {
          setErr("Failed to delete user.");
          console.error(e);
       } finally {
          setBusyId(null);
       }
    };

    return (
        <div className="mx-auto max-w-6xl p-6">
            <header className="mb-6 flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">User Management</h1>
                <p className="text-sm text-gray-600">Manage your users efficiently</p>
            </header>

            <form onSubmit={onSubmit} className="mb-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid gap-1">
                    <label className="text-sm font-medium">Name *</label>
                    <input
                        className="rounded-lg border border-gray-300 px-3 py-2 outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2"
                        placeholder="e.g. Jane Cooper"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm font-medium">Username *</label>
                    <input
                        className="rounded-lg border border-gray-300 px-3 py-2 outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2"
                        placeholder="e.g. janecooper"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="grid gap-1">
                    <label className="text-sm font-medium">Email *</label>
                    <input
                        className="rounded-lg border border-gray-300 px-3 py-2 outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2"
                        placeholder="e.g. jane@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        inputMode="email"
                    />
                </div>

                <div className="mt-2 flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={loading || busyId !== null}
                        className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isEditing ? (busyId ? "Saving..." : "Update") : (loading ? "Saving..." : "Create")}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={busyId !== null}
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>
                    )}

                    {err && <span className="text-sm text-red-600">{err}</span>}
                </div>
            </form>

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
                    <tbody className="divide-y divide-gray-100">
                        {rows.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <Td>{u.id}</Td>
                                <Td>{u.name}</Td>
                                <Td>{u.username}</Td>
                                <Td>
                                    <a
                                        href={`mailto:${u.email}`}
                                        className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
                                    >
                                        {u.email}
                                    </a>
                                </Td>
                                <Td>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(u)}
                                            disabled={busyId !== null}
                                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(u)}
                                            disabled={busyId === u.id}
                                            className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {busyId === u.id ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </Td>
                            </tr>
                        ))}
                        {!loading && rows.length === 0 && (
                            <tr>
                                <Td colSpan={5} className="text-center text-gray-500">No data.</Td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Endpoint: <code className="rounded bg-gray-100 px-1.5 py-0.5">https://jsonplaceholder.typicode.com/users</code>
                </p>
                <button
                    onClick={async () => {
                        setLoading(true);
                        setErr("");
                        try {
                            const data = await usersApi.list(8);
                            setRows(data);
                        } catch {
                            setErr("Failed to refresh users.");
                        } finally {
                            setLoading(false);
                        }
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>
        </div>
    );
};

