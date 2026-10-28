import React, { useEffect, useState } from "react";
import {
  Card, Statistic, Row, Col, Button, Segmented, message, Spin, Empty,
} from "antd";
import {
  ShoppingOutlined, CheckCircleOutlined, StopOutlined, DollarOutlined,
} from "@ant-design/icons";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import { getSalesReport } from "../../../config/SellerRequest";

const COLORS = ["#1677ff", "#52c41a", "#ff4d4f", "#faad14", "#722ed1"];

const STATUS_LABEL = {
  pending: "Chờ XN",
  confirmed: "Xác nhận",
  delivered: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
};

const SalesReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("month");

  const fetchReport = async (type) => {
    setLoading(true);
    try {
      const res = await getSalesReport(type);
      setData(res?.metadata || null);
    } catch {
      message.error("Không tải được báo cáo doanh số");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(period); }, [period]);

  const pieData = (data?.ordersByStatus || []).map((s) => ({
    name: STATUS_LABEL[s._id] || s._id,
    value: s.count,
  }));

  const barData = (data?.dailyRevenue || []).map((d) => ({
    date: d._id,
    "Doanh thu": d.revenue,
    "Đơn hàng": d.orders,
  }));

  if (loading) return <Spin fullscreen />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>📊 Báo cáo doanh số</h2>
        <Segmented
          options={[
            { label: "7 ngày qua", value: "week" },
            { label: "30 ngày qua", value: "month" },
          ]}
          value={period}
          onChange={(v) => setPeriod(v)}
        />
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Statistic
              title="Tổng đơn hàng"
              value={data?.summary?.totalOrders || 0}
              prefix={<ShoppingOutlined style={{ color: "#1677ff" }} />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Statistic
              title="Đơn hoàn thành"
              value={data?.summary?.completedOrders || 0}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Statistic
              title="Đơn đã huỷ"
              value={data?.summary?.cancelledOrders || 0}
              prefix={<StopOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Statistic
              title="Doanh thu"
              value={data?.summary?.totalRevenue || 0}
              prefix={<DollarOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
              suffix="đ"
              formatter={(v) => Number(v).toLocaleString("vi-VN")}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Biểu đồ doanh thu theo ngày */}
        <Col xs={24} lg={16}>
          <Card
            title="Doanh thu theo ngày"
            bordered={false}
            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            {barData.length === 0 ? (
              <Empty description="Chưa có dữ liệu" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v, name) => name === "Doanh thu" ? `${Number(v).toLocaleString("vi-VN")}đ` : v} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="Doanh thu" fill="#1677ff" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="Đơn hàng" fill="#52c41a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        {/* Biểu đồ trạng thái đơn hàng */}
        <Col xs={24} lg={8}>
          <Card
            title="Phân bố trạng thái đơn"
            bordered={false}
            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            {pieData.length === 0 ? (
              <Empty description="Chưa có dữ liệu" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SalesReport;
