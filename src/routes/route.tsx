import LandingLayout from "../layouts/LandingLayout";
import Home from "../pages/Home";

import DBLayout from "@/layouts/DBLayout";
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

import { AddRole } from "@/pages/DashBoard/AddRolePage";
import RoleDB from "@/pages/DashBoard/RolePage";

import EditUser from "@/containers/DashBoardPage/UsersDB/EditUser";
import UsersDB from "@/pages/DashBoard/UsersDB";

import ChangePassword from "@/containers/User/ChangePassword";
import DropdownNavbarComponent from "@/containers/User/NavUser";
import UserSettings from "@/containers/User/UserSettings";
import ChatPage from "@/pages/ChatPage";
import VideoCallPage from "@/pages/VideoCallPage";

import NewsFeedsPage from "@/pages/NewsFeedsPage";


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
    // Thêm các route công khai khác
];

const protectedRoutes: Route[] = [
    {
        path: "/",
        component: Home,
        layout: LandingLayout,
        requiresAuth: true,
    },
    {
        path: "/chat",
        component: ChatPage,
        requiresAuth: true,
    },
    {
        path: "/call/:conversationId",
        component: VideoCallPage,
        requiresAuth: true,
    },
    {
        path: "/post",
        component: Post,
        requiresAuth: true,
    },
    {
        path: "/social",
        component: MainSocial,
        requiresAuth: true,
    },
    {
        path: "/profile",
        component: Profile,
        requiresAuth: true,
    },
    {
        path: "/edit-profile",
        component: EditProfile,
        requiresAuth: true,
    },
    {
        path: "/nav-home",
        component: DropdownNavbarComponent,
        requiresAuth: true,
    },
    {
        path: "/settings",
        component: UserSettings,
        requiresAuth: true,
    },
    {
        path: "/settings/change-password",
        component: ChangePassword,
        requiresAuth: true,
    },
    {
        path: "/newsfeeds",
        component: NewsFeedsPage,
    },
    // Thêm các route bảo vệ khác
];

const adminRoutes: Route[] = [
    {
        path: "/dashboard",
        component: MainDashBoardPage,
        layout: DBLayout,
        requiresAuth: true,
        roles: ["ADMIN"],
    },
    {
        path: "/dashboard/role",
        component: RoleDB,
        layout: DBLayout,
        requiresAuth: true,
        roles: ["ADMIN"],
    },

    {
        path: "/dashboard/role",
        component: RoleDB,
        layout: DBLayout,
    },






    // {

    //     path: "/dashboard/permission",
    //     component: Permission,
    //     layout: DBLayout,
    // },
    // {
    //     path: "/dashboard/permission/addpermission",
    //     component: AddPermission,
    //     layout: DBLayout,
    // },
    // {
    //     path: "/dashboard/permission/updatepermission/:id",
    //     component: UpdatePermission,
    //     layout: DBLayout,
    // },

    {
        path: "/dashboard/role/add",
        component: AddRole,
        layout: DBLayout,
        requiresAuth: true,
        roles: ["ADMIN"],
    },
    {
        path: "/dashboard/users",
        component: UsersDB,
        layout: DBLayout,
        requiresAuth: true,
        roles: ["ADMIN"],
    },
    {
        path: "/dashboard/users/:userId",
        component: EditUser,
        layout: DBLayout,
        requiresAuth: true,
        roles: ["ADMIN"],
    },
    // Thêm các route ADMIN khác
];

export { publicRoutes, protectedRoutes, adminRoutes };