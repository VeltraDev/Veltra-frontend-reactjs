/* eslint-disable @typescript-eslint/no-explicit-any */

import LandingLayout from "../layouts/LandingLayout";
import Home from "../pages/Home";


import MainDashBoardPage from "@/pages/DashBoard/MainDashBoard";
import AuthLayout from "../layouts/AuthLayout";
import AuthPage from "../pages/Auth";
import ForgotPasswordPage from "../pages/Auth/ForgotPassword";
import ResetPasswordPage from "../pages/Auth/ResetPassword";
import VerifyEmailPage from "../pages/Auth/VerifyEmail";



import MainSocial from "../containers/SocialPage/MainSocial";
import Post from "../pages/PostForm";
import Profile from "../pages/Profile"
import EditProfile from '../pages/EditProfile';


// import { AddRole } from "@/pages/DashBoard/AddRolePage";
import RoleDB from "@/pages/DashBoard/RolePage";

// import EditUser from "@/containers/DashBoardPage/UsersDB/EditUser";
import UsersDB from "@/pages/DashBoard/UsersDB";


import ChangePassword from "@/containers/User/ChangePassword";
// import DropdownNavbarComponent from "@/containers/User/NavUser";
// import UserSettings from "@/containers/User/UserSettings";
import ChatPage from "@/pages/ChatPage";
import VideoCallPage from "@/pages/VideoCallPage";
import { DashboardLayout } from "@/layouts/DBLayout";
import { UsersDBPage } from "@/pages/DashBoard/UsersDBPage";
import { RolesDBPage } from "@/pages/DashBoard/RoleDBPage";
import { PermissionsDBPage } from "@/pages/DashBoard/PermissionsDBPage";
import { ReactionTypesPage } from "@/pages/DashBoard/ReactionTypesPage";
import { EditUserDBPage } from "@/pages/DashBoard/EditUserPage";
import { EditRolePage } from "@/pages/DashBoard/EditRoleDBPage";
import { Edit } from "lucide-react";
import { EditPermissionPage } from "@/pages/DashBoard/EditPermissionsDBPage";
import HomeDBPage from "@/pages/DashBoard/HomeDBPage";

interface Route {
    path: string;
    component: React.ComponentType<any>;
    layout?: React.ComponentType<any>;
    params?: Record<string, any>;
}

const publicRoutes: Route[] = [
    {
        path: "/",
        component: Home,
        layout: LandingLayout,
    },
    {
        path: "/auth",
        component: AuthPage,
        layout: LandingLayout,
    },
    {
        path: "/chat",
        component: ChatPage,

    },
    {
        path: "/call/:conversationId",
        component: VideoCallPage,

    },

    {
        path: "/post",
        component: Post,

    },

    {
        path: "/social",
        component: MainSocial,
    },

    {
        path: "/profile",
        component: Profile,
    },
    {
        path: "/edit-profile",
        component: EditProfile,
    },

    {
        path: "/forgot-password",
        component: ForgotPasswordPage,
        layout: AuthLayout,
        params: { token: ':token' },
    },
    {
        path: "/reset-password",
        component: ResetPasswordPage,
        layout: AuthLayout,
        params: { token: ':token' },
    },
    {
        path: "/verify-email",
        component: VerifyEmailPage,
        layout: AuthLayout,
        params: { token: ':token' },
    },
    // {
    //     path: "/dashboard",
    //     component: MainDashBoardPage,
    //     layout: DashboardLayout,
    // },
    // {
    //     path: "/dashboard/role",
    //     component: RoleDB,
    //     layout: DashboardLayout,
    // },
    // {

    //     path: "/dashboard/permission",
    //     component: Permission,
    //     layout: DashboardLayout,
    // },
    // {
    //     path: "/dashboard/permission/addpermission",
    //     component: AddPermission,
    //     layout: DashboardLayout,
    // },
    // {
    //     path: "/dashboard/permission/updatepermission/:id",
    //     component: UpdatePermission,
    //     layout: DashboardLayout,
    // },
    // {
    //     path: "/dashboard/role/add",
    //     component: AddRole,
    //     layout: DashboardLayout,
    // },
    {
        path: "/dashboard/users",
        component: UsersDBPage,
        layout: DashboardLayout,
    },
    {
        path: "/dashboard/users/edit/:id",
        component: EditUserDBPage,
        layout: DashboardLayout,
    },

    {
        path: "/dashboard/roles",
        component: RolesDBPage,
        layout: DashboardLayout,
    },
    {
        path: "/dashboard/roles/edit/:id",
        component: EditRolePage,
        layout: DashboardLayout,
    },
    {
        path: "/dashboard/permissions",
        component: PermissionsDBPage,
        layout: DashboardLayout,
    },
    {
        path: "/dashboard/permissions/edit/:id",
        component: EditPermissionPage,
        layout: DashboardLayout,
    },
    {
        path: "/dashboard/reaction-types",
        component: ReactionTypesPage,
        layout: DashboardLayout,
    },
    {
        path: "/dashboard",
        component: HomeDBPage,
        layout: DashboardLayout,
    },

    // {
    //     path: "/dashboard/users/:userId",
    //     component: EditUser,
    //     layout: DashboardLayout,
    // },

    // {
    //     path: "/nav-home",
    //     component: DropdownNavbarComponent,
    // },
    // {
    //     path: "/settings/change-password",
    //     component: ChangePassword,
    // },

    // {
    //     path: "/settings",
    //     component: UserSettings,
    // },




];

const privateRoutes: Route[] = [];

export { privateRoutes, publicRoutes };
