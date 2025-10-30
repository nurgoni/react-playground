import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { usersApi } from "../service/user";
import UserForm from "../components/userForm"


export default function EditUser() {
    const { id } = useParams();
    const nav = useNavigate();

    const [initial, setInitial] = useState({
        name: "",
        username: "",
        email: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            setErr("");
            try {
                const u = await usersApi.get(id);
                setInitial({
                    name: u.name ?? "",
                    username: u.username ?? "",
                    email: u.email ?? "",
                });
            } catch {
                setErr("Failed to load user.");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleUpdate = async (form) => {
        setErr("");
        try {
            setSaving(true);
            await usersApi.update(id, {id, ...form});
            nav("/");
        } catch {
            setErr("Failed to update user.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Edit User</h1>
                <Link to="/" className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
                    ← Back
                </Link>
            </div>

            {loading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">Loading...</div>
            ) : (
                <UserForm initial={initial} onSubmit={handleUpdate} submitting={saving} submitText="Update"/>
            )}

            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
            <p className="mt-3 text-sm text-gray-600">PUT /users/:id (mock, not persisted)</p>
        </div>
    );
}
