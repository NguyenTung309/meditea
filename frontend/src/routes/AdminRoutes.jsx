import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spin, message } from "antd";
import { adminCheck } from "../config/AuthRequest";

const AdminRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await adminCheck();
        setIsAdmin(true);
      } catch (error) {
        message.error("Bạn không có quyền truy cập admin");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) return <Spin fullscreen />;

  if (!isAdmin) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default AdminRoute;
