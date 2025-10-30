import { useEffect, useState } from "react";


function Field({ label, children }){
    return (
        <div className="grid gap-1">
            <label className="text-sm font-medium">{label}</label>
            {children}
        </div>
    );
}

export default function UserForm({
    initial = {name: "", username: "", email: ""},
    onSubmit,
    submitting = false,
    submitText = "Save"
}) {
    const [form, setForm] = useState(initial);
    const [err, setErr] = useState("");

    useEffect(() => {
        setForm(initial);
    }, [initial]);

    const handleChange = (e) => {
        setForm((f) => ({...f, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        if (!form.name.trim()) return setErr("Name is required.");
        if (!form.username.trim()) return setErr("Username is required");
        if (!form.email.trim() || !form.email.includes("@")) return setErr("Valid email is required.");
        await onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Field label="Name *">
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2"
                    placeholder="e.g. Jane Cooper"
                />
            </Field>

            <Field label="Username *">
                <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2"
                    placeholder="e.g. janecooper"
                />
            </Field>

            <Field label="Email *">
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2"
                    placeholder="e.g. jane@example.com"
                    inputMode="email"
                />
            </Field>

            <div className="mt-2 flex items-center gap-3">
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
                >
                    {submitting ? "Saving..." : submitText}
                </button>
                {err && <span className="text-sm text-red-600">{err}</span>}
            </div>
        </form>
    );
}
