import LandingLayout from "../layouts/LandingLayout";
import Home from "../pages/Home";



import AuthLayout from "../layouts/AuthLayout";
import AuthPage from "../pages/Auth";
import ForgotPasswordPage from "../pages/Auth/ForgotPassword";
import ResetPasswordPage from "../pages/Auth/ResetPassword";
import VerifyEmailPage from "../pages/Auth/VerifyEmail";

import MainSocial from "../containers/SocialPage/MainSocial";
import EditProfile from '../pages/EditProfile';
import Post from "../pages/PostForm";
import Profile from "../pages/Profile";




import ChatPage from "@/pages/ChatPage";
import VideoCallPage from "@/pages/VideoCallPage";

import { UsersDBPage } from "@/pages/DashBoard/UsersDBPage";
import NewsFeedsPage from "@/pages/NewsFeedsPage";

import ChangePassword from "@/containers/User/ChangePassword";
import UserSettings from "@/containers/User/UserSettings";
import { DashboardLayout } from "@/layouts/DBLayout";
import { EditPermissionPage } from "@/pages/DashBoard/EditPermissionsDBPage";
import { EditRolePage } from "@/pages/DashBoard/EditRoleDBPage";
import { EditUserDBPage } from "@/pages/DashBoard/EditUserPage";
import HomeDBPage from "@/pages/DashBoard/HomeDBPage";
import { PermissionsDBPage } from "@/pages/DashBoard/PermissionsDBPage";
import { ReactionTypesPage } from "@/pages/DashBoard/ReactionTypesPage";
import { RolesDBPage } from "@/pages/DashBoard/RoleDBPage";


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
];

const adminRoutes: Route[] = [
  

  




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

  
    // Thêm các route ADMIN khác
];

export { adminRoutes, protectedRoutes, publicRoutes };
