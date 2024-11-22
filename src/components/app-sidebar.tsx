import * as React from "react";
import { ChevronRight, User, Shield, LogOut, ThumbsUp, Home } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

// This is sample data.
const data = {
    
    navMain: [
        {
            title: "Manage",
            url: "/dashboard",
            icon: <User className="mr-2 w-4 h-4" />,
            items: [
                {
                    title: "Home",
                    url: "/dashboard",
                    icon: <Home className="mr-2 w-4 h-4" />,
                },
                {
                    title: "User",
                    url: "/dashboard/users",
                    icon: <User className="mr-2 w-4 h-4" />,
                },
                {
                    title: "Permission",
                    url: "/dashboard/permissions",
                    icon: <Shield className="mr-2 w-4 h-4" />,
                },
                {
                    title: "Role",
                    url: "/dashboard/roles",
                    icon: <Shield className="mr-2 w-4 h-4" />,
                },
                {
                    title: "Reaction Type",
                    url: "/dashboard/reaction-types",
                    icon: <ThumbsUp className="mr-2 w-4 h-4" />,
                },
            ],
        },
    ],
};

const userInfo = {
    name: "John Doe",
    isAdmin: true,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user,logout } = useAuth()

    return (
        <Sidebar {...props}>
            
            <SidebarHeader>
           
                <SearchForm />
                {/* User Information */}
                <div className="flex items-center justify-between mt-4 p-3 bg-gray-100 rounded-md">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                                {user?.user?.firstName[0]}
                            </span>
                        </div>
                        {/* User Details */}
                        <div>
                            <p className="text-sm font-medium">
                                {user?.user?.firstName + " " + user?.user?.lastName}
                            </p>
                            <p className="text-xs text-gray-400">
                                {user?.user?.role?.name?.isAdmin ? "Admin" : "User"}
                            </p>
                        </div>
                    </div>
                    <button className="text-red-500 hover:text-red-700">
                        <LogOut className="w-5 h-5" onClick={logout}/>
                    </button>
                </div>
            </SidebarHeader>
            <SidebarContent className="gap-0">
                {/* Navigation */}
                {data.navMain.map((item) => (
                    <Collapsible
                        key={item.title}
                        title={item.title}
                        defaultOpen
                        className="group/collapsible"
                    >
                        <SidebarGroup>
                            <SidebarGroupLabel
                                asChild
                                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                                <CollapsibleTrigger>
                                    {item.icon}
                                    {item.title}
                                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuItem key={subItem.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={subItem.isActive}
                                                >
                                                    <a href={subItem.url} className="flex items-center">
                                                        {subItem.icon}
                                                        {subItem.title}
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
