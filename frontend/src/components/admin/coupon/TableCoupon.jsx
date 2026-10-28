import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Table,
  message,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import {
  listCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../../config/CouponRequest";

const { RangePicker } = DatePicker;

const TableCoupon = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  // EDIT modal
  const [openEdit, setOpenEdit] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editForm] = Form.useForm();

  // ADD modal
  const [openAdd, setOpenAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm] = Form.useForm();

  const normalizeList = (res) => {
    // tuỳ backend của bạn trả về kiểu gì: {metadata: []} | {data: []} | []
    const raw = res?.metadata || res?.data || res || [];
    const arr = Array.isArray(raw) ? raw : raw?.coupons || raw?.items || [];
    return arr;
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await listCoupon();
      const arr = normalizeList(res);

      const mapped = arr.map((item) => ({
        key: item?._id || item?.id,
        _id: item?._id || item?.id,
        nameCoupon: item?.nameCoupon,
        discount: item?.discount,
        quantity: item?.quantity,
        startDate: item?.startDate,
        endDate: item?.endDate,
        minPrice: item?.minPrice,
      }));

      setDataSource(mapped);
    } catch (err) {
      console.log(err);
      message.error("Không lấy được danh sách coupon");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const start = async () => {
    await fetchCoupons();
    setSelectedRowKeys([]);
  };

  // ===== ADD =====
  const openAddModal = () => {
    setOpenAdd(true);
    addForm.resetFields();
  };

  const closeAddModal = () => {
    setOpenAdd(false);
    addForm.resetFields();
  };

  const onAddCoupon = async () => {
    try {
      const values = await addForm.validateFields();
      const [start, end] = values.dateRange || [];

      const payload = {
        nameCoupon: values.nameCoupon,
        discount: values.discount,
        quantity: values.quantity,
        minPrice: values.minPrice,
        startDate: start ? start.toISOString() : undefined,
        endDate: end ? end.toISOString() : undefined,
      };

      setAddLoading(true);
      await createCoupon(payload);

      message.success("Thêm coupon thành công");
      closeAddModal();
      await fetchCoupons();
    } catch (err) {
      if (err?.errorFields) return;
      console.log(err);
      message.error("Thêm coupon thất bại");
    } finally {
      setAddLoading(false);
    }
  };

  // ===== EDIT =====
  const openEditModal = (row) => {
    setEditingRow(row);
    setOpenEdit(true);

    editForm.setFieldsValue({
      nameCoupon: row?.nameCoupon || "",
      discount: row?.discount ?? 0,
      quantity: row?.quantity ?? 0,
      minPrice: row?.minPrice ?? 0,
      dateRange: [
        row?.startDate ? dayjs(row.startDate) : null,
        row?.endDate ? dayjs(row.endDate) : null,
      ],
    });
  };

  const closeEditModal = () => {
    setOpenEdit(false);
    setEditingRow(null);
    editForm.resetFields();
  };

  const onSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingRow?._id) return message.error("Thiếu id coupon");

      const [start, end] = values.dateRange || [];

      const payload = {
        nameCoupon: values.nameCoupon,
        discount: values.discount,
        quantity: values.quantity,
        minPrice: values.minPrice,
        startDate: start ? start.toISOString() : undefined,
        endDate: end ? end.toISOString() : undefined,
      };

      setEditLoading(true);
      await updateCoupon(editingRow._id, payload);

      message.success("Cập nhật coupon thành công");
      closeEditModal();
      await fetchCoupons();
    } catch (err) {
      if (err?.errorFields) return;
      console.log(err);
      message.error("Cập nhật thất bại");
    } finally {
      setEditLoading(false);
    }
  };

  // ===== DELETE =====
  const onDelete = (row) => {
    Modal.confirm({
      title: "Xoá coupon?",
      content: `Bạn chắc chắn muốn xoá "${row?.nameCoupon}" không?`,
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await deleteCoupon(row._id);
          message.success("Đã xoá coupon");
          await fetchCoupons();
          setSelectedRowKeys((prev) => prev.filter((k) => k !== row.key));
        } catch (err) {
          console.log(err);
          message.error("Xoá thất bại");
        }
      },
    });
  };

  const columns = [
    { title: "Name", dataIndex: "nameCoupon" },
    { title: "Discount", dataIndex: "discount" },
    { title: "Quantity", dataIndex: "quantity" },
    {
      title: "Min Price",
      dataIndex: "minPrice",
      render: (v) => (typeof v === "number" ? v.toLocaleString("vi-VN") : v),
    },
    {
      title: "Start",
      dataIndex: "startDate",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "End",
      dataIndex: "endDate",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : ""),
    },
    {
      title: "Action",
      key: "action",
      render: (_, row) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(row)}>
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(row)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle">
          <Button type="primary" onClick={start} loading={loading}>
            Reload
          </Button>

          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Add Coupon
          </Button>

          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
        </Flex>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Flex>

      {/* ADD MODAL */}
      <Modal
        title="Add Coupon"
        open={openAdd}
        onCancel={closeAddModal}
        onOk={onAddCoupon}
        okText="Create"
        confirmLoading={addLoading}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="Tên Coupon"
            name="nameCoupon"
            rules={[{ required: true, message: "Vui lòng nhập tên coupon" }]}
          >
            <Input placeholder="VD: SALE10" />
          </Form.Item>

          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: "Vui lòng nhập discount" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập quantity" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Min Price"
            name="minPrice"
            rules={[{ required: true, message: "Vui lòng nhập minPrice" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Start - End Date"
            name="dateRange"
            rules={[{ required: true, message: "Vui lòng chọn start/end" }]}
          >
            <RangePicker showTime style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        title="Edit Coupon"
        open={openEdit}
        onCancel={closeEditModal}
        onOk={onSaveEdit}
        okText="Save"
        confirmLoading={editLoading}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Tên Coupon"
            name="nameCoupon"
            rules={[{ required: true, message: "Vui lòng nhập tên coupon" }]}
          >
            <Input placeholder="VD: SALE10" />
          </Form.Item>

          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: "Vui lòng nhập discount" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập quantity" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Min Price"
            name="minPrice"
            rules={[{ required: true, message: "Vui lòng nhập minPrice" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Start - End Date"
            name="dateRange"
            rules={[{ required: true, message: "Vui lòng chọn start/end" }]}
          >
            <RangePicker showTime style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableCoupon;
