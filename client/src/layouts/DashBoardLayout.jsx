import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function DashboardLayout() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            window.location.href = "/login";
        }
    };

    const navItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
        },
        {
            label: "Monitors",
            path: "/monitors",
        },
        {
            label: "Incidents",
            path: "/incidents",
        },
        {
            label: "History",
            path: "/history",
        },
        {
            label: "Status Page",
            path: "/status",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="flex min-h-screen">

                {/* Sidebar */}
                <aside className="hidden w-64 border-r border-white/10 bg-white/3 md:flex md:flex-col">

                    {/* Logo */}
                    <div className="flex h-16 items-center border-b border-white/10 px-6">
                        <div>
                            <h1 className="text-lg font-semibold">
                                API Sentinel
                            </h1>

                            <p className="text-xs text-slate-500">
                                API Reliability Platform
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 p-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `block rounded-lg px-4 py-3 text-sm transition ${
                                        isActive
                                            ? "bg-indigo-600/20 text-indigo-400"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User */}
                    <div className="border-t border-white/10 p-4">
                        <div className="mb-3 truncate text-sm text-slate-400">
                            {user?.email || "User"}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main area */}
                <main className="flex min-w-0 flex-1 flex-col">

                    {/* Top bar */}
                    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-white/2 px-6">
                        <div>
                            <p className="text-sm text-slate-400">
                                API Monitoring
                            </p>
                        </div>

                        <div className="text-sm text-slate-400">
                            {user?.email}
                        </div>
                    </header>

                    {/* Page content */}
                    <section className="flex-1 p-6">
                        <Outlet />
                    </section>
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;