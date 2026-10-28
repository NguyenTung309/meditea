import React, { useEffect, useState } from "react";
import { Table, Tag, Rate, Button, message, Flex, Image } from "antd";
import dayjs from "dayjs";
import { getAllReviews } from "../../../config/SellerRequest";

const TableReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getAllReviews();
      setReviews((res?.metadata || []).map((r) => ({ ...r, key: r._id })));
    } catch {
      message.error("Không tải được danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, r) => (
        <Flex align="center" gap={8}>
          {r.productId?.imagesProduct?.[0] && (
            <Image
              src={r.productId.imagesProduct[0]}
              width={48}
              height={48}
              style={{ objectFit: "cover", borderRadius: 6 }}
              preview={false}
            />
          )}
          <span style={{ fontWeight: 500 }}>{r.productId?.nameProduct || "—"}</span>
        </Flex>
      ),
    },
    {
      title: "Người dùng",
      key: "user",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.userId?.fullName || "—"}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{r.userId?.email}</div>
        </div>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      render: (v) => <Rate disabled value={v} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Nhận xét",
      dataIndex: "comment",
      render: (v) => v || <span style={{ color: "#aaa" }}>Không có nhận xét</span>,
      ellipsis: true,
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "createdAt",
      render: (v) => dayjs(v).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
  ];

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Đánh giá sản phẩm</h2>
        <Button onClick={fetchReviews} loading={loading}>Tải lại</Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={reviews}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default TableReview;
