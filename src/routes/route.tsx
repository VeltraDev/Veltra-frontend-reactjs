/* eslint-disable @typescript-eslint/no-explicit-any */

import LandingLayout from "../layouts/LandingLayout";
import Home from "../pages/Home";


interface Route {
    path: string;
    component: React.ComponentType<any>;
    layout?: React.ComponentType<any>;
}

const publicRoutes: Route[] = [
    {
        path: "/",
        component: Home,
        layout: LandingLayout,
    },

    // {
    //     path: "/contact",
    //     component: ContactUs,
    //     layout: MainLayout,
    // },
    // {
    //     path: "/product",
    //     component: ProductPage,
    //     layout: MainLayout,
    // },

    // {
    //     path: "/sign-up",
    //     component: AuthPage,
    //     layout: MainLayout,
    // },
    // {
    //     path: "/sign-in",
    //     component: AuthPage,
    //     layout: MainLayout,
    // },
    // {
    //     path: "/product/:productId",
    //     component: DetailPage,
    //     layout: MainLayout,
    // },
    // {
    //     path: "/verify-email",
    //     component: VerifyEmail,
    //     layout: BlankLayout,
    // },


    // {
    //     path: "/cart",
    //     component: CartPage,
    //     layout: MainLayout,
    // },
];
const privateRoutes: Route[] = [

    // {
    //     path: "/cart",
    //     component: CartPage,
    //     layout: MainLayout,
    // },
    // {
    //     path: "/couponpage",
    //     component: CouponPage,
    //     layout: MainLayout,
    // },
    // {
    //     path: "/shipping-state",
    //     component: ShippingState,
    //     layout: MainLayout,
    // },



    // {
    //     path: "/dashboard/products",
    //     component: DashBoardProduct,
    //     layout: DashBoardLayout,
    // },
    // {
    //     path: "/dashboard/categories",
    //     component: DashBoardCategories,
    //     layout: DashBoardLayout,
    // },
    // {
    //     path: "/dashboard",
    //     component: DashBoard,
    //     layout: DashBoardLayout,
    // },
    // {
    //     path: "/dashboard/products/AddProduct",
    //     component: AddProduct,
    //     layout: DashBoardLayout,
    // },
    // {
    //     path: "/dashboard/categories/AddCategory",
    //     component: AddCategory,
    //     layout: DashBoardLayout,
    // },
    // {
    //     path: "/dashboard/categories/:idUpdateCategory",
    //     component: CategoryUpdateForm,
    //     layout: DashBoardLayout,
    // },
    // {
    //     path: "/dashboard/products/:idUpdateProduct",
    //     component: ProductUpdateForm,
    //     layout: DashBoardLayout,
    // },

    // {
    //     path: "/wishlist",
    //     component: WishList,
    //     layout: DashBoardUser
    // },
    // {
    //     path: "/orderhistory",
    //     component: OrderHistory,
    //     layout: DashBoardUser
    // },
    // {
    //     path: "/MyAccount",
    //     component: ProfilePage,
    //     layout: DashBoardUser
    // },
    // {
    //     path: "/address",
    //     component: AddressPage,
    //     layout: DashBoardUser
    // },

    // {
    //     path: "/address/billing-address",
    //     component: BillingPage,
    //     layout: MainLayout
    // },
];

export { privateRoutes, publicRoutes };