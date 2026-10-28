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
  Switch,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../config/UserRequest";

const TableUser = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const [openEdit, setOpenEdit] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editForm] = Form.useForm();

  const [openAdd, setOpenAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      const arr = res?.metadata || [];

      const mapped = arr.map((item) => ({
        key: item._id,
        _id: item._id,
        fullName: item.fullName,
        email: item.email,
        phoneNumber: item.phoneNumber,
        date: item.date,
        dob: item.dob,
        isAdmin: item.isAdmin,
        createdAt: item.createdAt,
      }));

      setDataSource(mapped);
    } catch (err) {
      console.log(err);
      message.error("Không lấy được danh sách user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const start = async () => {
    await fetchUsers();
    setSelectedRowKeys([]);
  };

  const openAddModal = () => {
    setOpenAdd(true);
    addForm.resetFields();
    addForm.setFieldsValue({ isAdmin: false });
  };

  const closeAddModal = () => {
    setOpenAdd(false);
    addForm.resetFields();
  };

  const onAddUser = async () => {
    try {
      const values = await addForm.validateFields();

      const payload = {
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        date: values.date,
        dob: values.dob,
        isAdmin: !!values.isAdmin,
      };

      setAddLoading(true);
      await createUser(payload);

      message.success("Thêm user thành công");
      closeAddModal();
      await fetchUsers();
    } catch (err) {
      if (err?.errorFields) return;
      console.log(err);
      message.error(err?.response?.data?.message || "Thêm user thất bại");
    } finally {
      setAddLoading(false);
    }
  };

  const openEditModal = (row) => {
    setEditingRow(row);
    setOpenEdit(true);

    editForm.setFieldsValue({
      fullName: row.fullName,
      email: row.email,
      phoneNumber: row.phoneNumber,
      password: "",
      date: row.date,
      dob: row.dob,
      isAdmin: row.isAdmin,
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

      if (!editingRow?._id) {
        return message.error("Thiếu id user");
      }

      const payload = {
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        date: values.date,
        dob: values.dob,
        isAdmin: !!values.isAdmin,
      };

      if (values.password) {
        payload.password = values.password;
      }

      setEditLoading(true);
      await updateUser(editingRow._id, payload);

      message.success("Cập nhật user thành công");
      closeEditModal();
      await fetchUsers();
    } catch (err) {
      if (err?.errorFields) return;
      console.log(err);
      message.error(err?.response?.data?.message || "Cập nhật user thất bại");
    } finally {
      setEditLoading(false);
    }
  };

  const onDelete = (row) => {
    Modal.confirm({
      title: "Xoá user?",
      content: `Bạn chắc chắn muốn xoá "${row?.fullName}" không?`,
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await deleteUser(row._id);
          message.success("Đã xoá user");
          await fetchUsers();
          setSelectedRowKeys((prev) => prev.filter((k) => k !== row.key));
        } catch (err) {
          console.log(err);
          message.error(err?.response?.data?.message || "Xoá user thất bại");
        }
      },
    });
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "DOB",
      dataIndex: "dob",
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      render: (v) => (v ? "Yes" : "No"),
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
            Add User
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

      <Modal
        title="Add User"
        open={openAdd}
        onCancel={closeAddModal}
        onOk={onAddUser}
        okText="Create"
        confirmLoading={addLoading}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^[0-9+\-\s()]{8,20}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Vui lòng nhập date" }]}
          >
            <Input placeholder="VD: 14/03/2026" />
          </Form.Item>

          <Form.Item
            label="DOB"
            name="dob"
            rules={[{ required: true, message: "Vui lòng nhập dob" }]}
          >
            <Input placeholder="VD: 01/01/2000" />
          </Form.Item>

          <Form.Item label="Admin" name="isAdmin" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit User"
        open={openEdit}
        onCancel={closeEditModal}
        onOk={onSaveEdit}
        okText="Save"
        confirmLoading={editLoading}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^[0-9+\-\s()]{8,20}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="password"
            extra="Để trống nếu không đổi mật khẩu"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Vui lòng nhập date" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="DOB"
            name="dob"
            rules={[{ required: true, message: "Vui lòng nhập dob" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Admin" name="isAdmin" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableUser;
