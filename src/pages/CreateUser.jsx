import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usersApi } from "../service/user";
import UserForm from "../components/userForm.jsx";


export default function CreateUser() {
    const nav = useNavigate();
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");

    const handleCreate = async (form) => {
        setErr("");
        try {
            setSaving(true);
            await usersApi.create(form);
            nav("/");
        } catch {
            setErr("Failed to create user.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Create User</h1>
                <Link to="/" className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
                    ← Back
                </Link>
            </div>

            <UserForm onSubmit={handleCreate} submitting={saving} submitText="Create"/>

            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
            <p className="mt-3 text-sm text-gray-600">POST /users (mock, not persisted)</p>
        </div>
    );
}