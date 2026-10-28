import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Table,
  message,
  Image,
  Space,
  Modal,
  Form,
  Input,
  Upload,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import {
  listCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../config/CategoryRequest";

const TableCategory = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  // EDIT modal
  const [openEdit, setOpenEdit] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editFileList, setEditFileList] = useState([]);
  const [editForm] = Form.useForm();

  // ADD modal
  const [openAdd, setOpenAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addFileList, setAddFileList] = useState([]);
  const [addForm] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await listCategory();
      const raw = res?.metadata || res?.data || res || [];
      const arr = Array.isArray(raw) ? raw : raw?.categories || [];

      const mapped = arr.map((item) => ({
        key: item?._id || item?.id,
        _id: item?._id || item?.id,
        nameCategory: item?.nameCategory,
        image: item?.imageCategory,
      }));

      setDataSource(mapped);
    } catch (err) {
      console.log(err);
      message.error("Không lấy được danh sách category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const start = async () => {
    await fetchCategories();
    setSelectedRowKeys([]);
  };

  // ===== EDIT =====
  const openEditModal = (row) => {
    setEditingRow(row);
    setOpenEdit(true);
    editForm.setFieldsValue({ nameCategory: row?.nameCategory || "" });
    setEditFileList([]);
  };

  const closeEditModal = () => {
    setOpenEdit(false);
    setEditingRow(null);
    setEditFileList([]);
    editForm.resetFields();
  };

  const onSaveEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!editingRow?._id) return message.error("Thiếu id category");

      const payload = { nameCategory: values.nameCategory };
      const pickedFile = editFileList?.[0]?.originFileObj;
      if (pickedFile) payload.imageCategory = pickedFile;

      setEditLoading(true);
      await updateCategory(editingRow._id, payload);

      message.success("Cập nhật category thành công");
      closeEditModal();
      await fetchCategories();
    } catch (err) {
      if (err?.errorFields) return;
      console.log(err);
      message.error("Cập nhật thất bại");
    } finally {
      setEditLoading(false);
    }
  };

  // ===== ADD =====
  const openAddModal = () => {
    setOpenAdd(true);
    addForm.resetFields();
    setAddFileList([]);
  };

  const closeAddModal = () => {
    setOpenAdd(false);
    addForm.resetFields();
    setAddFileList([]);
  };

  const onAddCategory = async () => {
    try {
      const values = await addForm.validateFields();

      const payload = { nameCategory: values.nameCategory };
      const file = addFileList?.[0]?.originFileObj;
      if (file) payload.imageCategory = file;

      setAddLoading(true);
      await createCategory(payload);

      message.success("Thêm category thành công");
      closeAddModal();
      await fetchCategories();
    } catch (err) {
      if (err?.errorFields) return;
      console.log(err);
      message.error("Thêm category thất bại");
    } finally {
      setAddLoading(false);
    }
  };

  // ===== DELETE =====
  const onDelete = (row) => {
    Modal.confirm({
      title: "Xoá category?",
      content: `Bạn chắc chắn muốn xoá "${row?.nameCategory}" không?`,
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await deleteCategory(row._id);
          message.success("Đã xoá category");
          await fetchCategories();
          setSelectedRowKeys((prev) => prev.filter((k) => k !== row.key));
        } catch (err) {
          console.log(err);
          message.error("Xoá thất bại");
        }
      },
    });
  };

  const columns = [
    { title: "Name", dataIndex: "nameCategory" },
    {
      title: "Image",
      dataIndex: "image",
      render: (src) =>
        src ? (
          <Image
            src={src}
            alt="category"
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          <span>Không có ảnh</span>
        ),
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
            Add Category
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

      {/* EDIT MODAL */}
      <Modal
        title="Edit Category"
        open={openEdit}
        onCancel={closeEditModal}
        onOk={onSaveEdit}
        okText="Save"
        confirmLoading={editLoading}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Tên Category"
            name="nameCategory"
            rules={[{ required: true, message: "Vui lòng nhập tên category" }]}
          >
            <Input placeholder="Nhập tên category..." />
          </Form.Item>

          <Form.Item label="Ảnh Category (tuỳ chọn)">
            <Upload
              listType="picture"
              maxCount={1}
              fileList={editFileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setEditFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>

            {editingRow?.image ? (
              <div style={{ marginTop: 12 }}>
                <div style={{ marginBottom: 6, fontSize: 12, opacity: 0.7 }}>
                  Ảnh hiện tại:
                </div>
                <Image
                  src={editingRow.image}
                  width={120}
                  height={120}
                  style={{ objectFit: "cover", borderRadius: 10 }}
                />
              </div>
            ) : null}
          </Form.Item>
        </Form>
      </Modal>

      {/* ADD MODAL */}
      <Modal
        title="Add Category"
        open={openAdd}
        onCancel={closeAddModal}
        onOk={onAddCategory}
        okText="Create"
        confirmLoading={addLoading}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="Tên Category"
            name="nameCategory"
            rules={[{ required: true, message: "Vui lòng nhập tên category" }]}
          >
            <Input placeholder="Nhập tên category..." />
          </Form.Item>

          <Form.Item label="Ảnh Category (tuỳ chọn)">
            <Upload
              listType="picture"
              maxCount={1}
              fileList={addFileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setAddFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableCategory;
