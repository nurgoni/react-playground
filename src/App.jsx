import { Outlet, NavLink } from "react-router-dom";


export default function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold">users CRUD</span>
                        <NavLink to="/" className="text-sm text-gray-600 hover:text-gray-900">
                            List
                        </NavLink>
                        <NavLink to="/users/new" className="text-sm text-gray-600 hover:text-gray-900">
                            Create
                        </NavLink>
                    </div>
                </div>
            </nav>
            <main>
                <Outlet/>
            </main>
        </div>
    );
}
