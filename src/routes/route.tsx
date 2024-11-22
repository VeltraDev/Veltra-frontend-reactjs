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
interface Route {
    path: string;
    component: React.ComponentType<any>;
    layout?: React.ComponentType<any>;
    params?: Record<string, any>;
    requiresAuth?: boolean; // Thêm thuộc tính yêu cầu xác thực
    roles?: string[];       // Thêm thuộc tính vai trò
}

const publicRoutes: Route[] = [
    {
        path: "/auth",
        component: AuthPage,
        layout: LandingLayout,
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
        path: "/dashboard/role/add",
        component: AddRole,
        layout: DBLayout,
    },
    {
        path: "/dashboard/users",
        component: UsersDB,
        layout: DBLayout,
    },

    {
        path: "/dashboard/users/:userId",
        component: EditUser,
        layout: DBLayout,
    },

    {
        path: "/nav-home",
        component: DropdownNavbarComponent,
    },
    {
        path: "/settings/change-password",
        component: ChangePassword,
    },

    {
        path: "/settings",
        component: UserSettings,
    },




];

const privateRoutes: Route[] = [];

export { publicRoutes, protectedRoutes, adminRoutes };