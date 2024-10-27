/* eslint-disable @typescript-eslint/no-explicit-any */

import LandingLayout from "../layouts/LandingLayout";
import Home from "../pages/Home";

import DBLayout from "@/layouts/DBLayout";
import MainDashBoardPage from "@/pages/DashBoard/MainDashBoard";
import AuthLayout from "../layouts/AuthLayout";
import AuthPage from "../pages/Auth";
import ForgotPasswordPage from "../pages/Auth/ForgotPassword";
import ResetPasswordPage from "../pages/Auth/ResetPassword";
import VerifyEmailPage from "../pages/Auth/VerifyEmail";
import ChatPage from "../pages/Chat";
import { RoleDB } from "@/pages/DashBoard/RoleDB";
import Permission from "@/containers/DashBoardPage/Permission/Main";
import AddPermission from "@/containers/DashBoardPage/Permission/AddPermission"
import UpdatePermission from "@/containers/DashBoardPage/Permission/UpdatePermission"

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
    {
        path: "/dashboard",
        component: MainDashBoardPage,
        layout: DBLayout,
    },
    {
        path: "/dashboard/role",
        component: RoleDB,
        layout: DBLayout,
    },
    {
        path: "/dashboard/permission",
        component: Permission,
        layout: DBLayout,
    },
    {
        path: "/dashboard/permission/addpermission",
        component: AddPermission,
        layout: DBLayout,
    },
    {
        path: "/dashboard/permission/updatepermission/:id",
        component: UpdatePermission,
        layout: DBLayout,
    }
    
];

const privateRoutes: Route[] = [];

export { privateRoutes, publicRoutes };
