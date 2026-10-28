import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import RegisterPage from "./pages/auth/Register.jsx";
import enUS from "antd/locale/en_US";

import LoginPage from "./pages/auth/Login.jsx";
import { ConfigProvider, message } from "antd";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Shop from "./pages/client/Shop.jsx";
import CreateUser from "./components/admin/user/CreateUser.jsx";
import DetailUser from "./components/admin/user/DetailUser.jsx";
import TableUser from "./components/admin/user/TableUser.jsx";
import UpdateUser from "./components/admin/user/UpdateUser.jsx";
import CreateProduct from "./components/admin/product/CreateProduct.jsx";
import TableProduct from "./components/admin/product/TableProduct.jsx";
import DetailProduct from "./components/admin/product/DetailProduct.jsx";
import DashBoard from "./components/admin/dashboard/Dashboard.jsx";
import UpdateProduct from "./components/admin/product/UpdateProduct.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import Story from "./components/about-us/Story.jsx";
import Philosophy from "./components/about-us/Story-3.jsx";
import Original from "./components/about-us/Story-2.jsx";
import AdminRoute from "./routes/AdminRoutes.jsx";
import TableCategory from "./components/admin/category/TableCategory.jsx";
import CreateCategory from "./components/admin/category/CreateCategory.jsx";
import UpdateCategory from "./components/admin/category/UpdateCategory.jsx";
import DetailCategory from "./components/admin/category/DetailCategory.jsx";
import Products3DList from "./pages/client/Products3DList.jsx";
import Product3DDetail from "./pages/client/Product3DDetail.jsx";
import TableCoupon from "./components/admin/coupon/TableCoupon.jsx";
import TableOrder from "./components/admin/order/TableOrder.jsx";
import ManageContent from "./components/admin/content/ManageContent.jsx";
import ManageGallery from "./components/admin/gallery/ManageGallery.jsx";
import ProductPage from "./pages/client/ProductPage.jsx";
import Cart from "./pages/cart/EbayCart.jsx";
import Checkout from "./pages/cart/Checkout.jsx";
import PaymentSuccess from "./pages/cart/PaymentSuccess.jsx";
import PaymentSepay from "./pages/cart/PaymentSepay.jsx";
import Homepage from "./components/Homepage.jsx";
import AboutPage from "./pages/client/AboutPage.jsx";
import BanchaPage from "./pages/client/BanchaPage.jsx";
import ProductMain from "./components/homepage/ProductMain.jsx";
import ProductList from "./components/homepage/ProductList.jsx";
import FAQ from "./pages/client/FAQ.jsx";
import Contact from "./pages/client/Contact.jsx";
import Media from "./pages/client/Media.jsx";
import Blog from "./pages/client/Blog.jsx";
import BlogDetail from "./pages/client/BlogDetail.jsx";
import PrivacyPolicy from "./pages/client/PrivacyPolicy.jsx";
import TermsOfService from "./pages/client/TermsOfService.jsx";

message.config({
  top: 96,
  maxCount: 3,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "product/:id",
        element: <ProductPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
       {
        path: "bancha-detail",
        element: <BanchaPage />,
      },
       {
        path: "product-main",
        element: <ProductMain />,
      },
      {
        path: "product-list",
        element: <ProductList />,
      },

      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "story",
        element: <Story />,
      },
      {
        path: "story-3",
        element: <Original />,
      },
      {
        path: "story-2",
        element: <Philosophy />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "faq",
        element: <FAQ />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "media",
        element: <Media />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms",
        element: <TermsOfService />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "blog/:id",
        element: <BlogDetail />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "payment-success/:orderId",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-sepay/:orderId",
        element: <PaymentSepay />,
      },
      // 3D Experience pages — standalone, no Header/Footer
      {
        path: "/3d-products",
        element: <Products3DList />,
      },
      {
        path: "/3d-products/:id",
        element: <Product3DDetail />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <DashBoard />,
        children: [
          { index: true, element: <TableUser /> },

          // USER
          { path: "table-user", element: <TableUser /> },
          { path: "create-user", element: <CreateUser /> },
          { path: "detail-user", element: <DetailUser /> },
          { path: "update-user", element: <UpdateUser /> },

          // PRODUCT
          { path: "table-product", element: <TableProduct /> },
          { path: "create-product", element: <CreateProduct /> },
          { path: "detail-product", element: <DetailProduct /> },
          { path: "update-product", element: <UpdateProduct /> },

          //Category
          { path: "table-category", element: <TableCategory /> },
          { path: "create-category", element: <CreateCategory /> },
          { path: "detail-category", element: <DetailCategory /> },
          { path: "update-category", element: <UpdateCategory /> },
          //coupon
          { path: "table-coupon", element: <TableCoupon /> },
          //order
          { path: "table-order", element: <TableOrder /> },
          { path: "manage-content", element: <ManageContent /> },
          { path: "manage-gallery", element: <ManageGallery /> },
        ],
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <AppProvider> */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ConfigProvider locale={enUS}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </GoogleOAuthProvider>
    {/* </AppProvider> */}
  </StrictMode>,
);
