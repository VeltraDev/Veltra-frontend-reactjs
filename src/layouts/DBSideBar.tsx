import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Users,
    Settings,
    FileText,
    Heart,
    Home,
    Menu,
    Shield,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className={cn(
                "pb-12 border-r h-screen transition-all duration-300",
                collapsed ? "w-16" : "w-64",
                className
            )}
        >
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center justify-between mb-2">
                        {!collapsed && <h2 className="text-lg font-semibold">Dashboard</h2>}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-1">
                        <NavLink to="/" end>
                            {({ isActive }) => (
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        collapsed && "justify-center"
                                    )}
                                >
                                    <Home className="h-4 w-4" />
                                    {!collapsed && <span className="ml-2">Overview</span>}
                                </Button>
                            )}
                        </NavLink>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                            {!collapsed && "Management"}
                        </h2>
                        <NavLink to="/users">
                            {({ isActive }) => (
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        collapsed && "justify-center"
                                    )}
                                >
                                    <Users className="h-4 w-4" />
                                    {!collapsed && <span className="ml-2">Users</span>}
                                </Button>
                            )}
                        </NavLink>
                        <NavLink to="/posts">
                            {({ isActive }) => (
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        collapsed && "justify-center"
                                    )}
                                >
                                    <FileText className="h-4 w-4" />
                                    {!collapsed && <span className="ml-2">Posts</span>}
                                </Button>
                            )}
                        </NavLink>
                        <NavLink to="/reactions">
                            {({ isActive }) => (
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        collapsed && "justify-center"
                                    )}
                                >
                                    <Heart className="h-4 w-4" />
                                    {!collapsed && <span className="ml-2">Reactions</span>}
                                </Button>
                            )}
                        </NavLink>
                        <NavLink to="/roles">
                            {({ isActive }) => (
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        collapsed && "justify-center"
                                    )}
                                >
                                    <Shield className="h-4 w-4" />
                                    {!collapsed && <span className="ml-2">Roles</span>}
                                </Button>
                            )}
                        </NavLink>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                            {!collapsed && "Settings"}
                        </h2>
                        <NavLink to="/settings">
                            {({ isActive }) => (
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        collapsed && "justify-center"
                                    )}
                                >
                                    <Settings className="h-4 w-4" />
                                    {!collapsed && <span className="ml-2">Settings</span>}
                                </Button>
                            )}
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}