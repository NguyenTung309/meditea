import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Table,
  Space,
  Popconfirm,
  Tag,
  message,
  Image,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Upload,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImageCropper from "./ImageCropper";
import {
  createProduct,
  deleteProduct,
  listProduct,
  updateProduct,
} from "../../../config/ProductRequest";
import { listCategory } from "../../../config/CategoryRequest";

const { TextArea } = Input;

const TableProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form] = Form.useForm();

  const [newImages, setNewImages] = useState([]);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [oldImages, setOldImages] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await listCategory();
      setCategories(res?.metadata || []);
    } catch (error) {
      console.error(error);
      message.error("Lấy danh sách danh mục thất bại");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await listProduct();
      const productData = res?.metadata || [];

      const mappedData = productData.map((item) => ({
        key: item._id,
        _id: item._id,
        imagesProduct: item.imagesProduct || [],
        image:
          Array.isArray(item.imagesProduct) && item.imagesProduct.length > 0
            ? item.imagesProduct[0]
            : "",
        nameProduct: item.nameProduct,
        priceProduct: item.priceProduct,
        discountProduct: item.discountProduct,
        stockProduct: item.stockProduct,
        categoryProduct: item.categoryProduct,
        isHidden: item.isHidden ?? false,
        descriptionProduct: item.descriptionProduct,
        createdAt: item.createdAt,
      }));

      setProducts(mappedData);
    } catch (error) {
      console.error(error);
      message.error("Lấy danh sách sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const resetModalState = () => {
    form.resetFields();
    setEditingProduct(null);
    setNewImages([]);
    setOldImages([]);
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setOldImages([]);
    setNewImages([]);
    form.setFieldsValue({
      nameProduct: "",
      priceProduct: 0,
      discountProduct: 0,
      stockProduct: 0,
      descriptionProduct: "",
      categoryProduct: undefined,
      isHidden: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingProduct(record);
    setOldImages(record.imagesProduct || []);
    setNewImages([]);

    form.setFieldsValue({
      nameProduct: record.nameProduct,
      priceProduct: record.priceProduct,
      discountProduct: record.discountProduct,
      stockProduct: record.stockProduct,
      descriptionProduct: record.descriptionProduct,
      categoryProduct:
        typeof record.categoryProduct === "object"
          ? record.categoryProduct?._id
          : record.categoryProduct,
      isHidden: record.isHidden ?? false,
    });

    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteProduct(id);
      message.success("Xóa sản phẩm thành công");
      setProducts((prev) => prev.filter((item) => item._id !== id));
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Xóa sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("nameProduct", values.nameProduct);
      formData.append("priceProduct", values.priceProduct ?? 0);
      formData.append("discountProduct", values.discountProduct ?? 0);
      formData.append("stockProduct", values.stockProduct ?? 0);
      formData.append("descriptionProduct", values.descriptionProduct);
      formData.append("categoryProduct", values.categoryProduct);
      formData.append("isHidden", values.isHidden ? "true" : "false");

      if (editingProduct) {
        formData.append("oldImagesProduct", JSON.stringify(oldImages || []));
      }

      newImages.forEach((file) => {
        if (file.originFileObj) {
          formData.append("imagesProduct", file.originFileObj);
        }
      });

      if (!editingProduct) {
        if (newImages.length === 0) {
          message.error("Vui lòng chọn ít nhất 1 ảnh sản phẩm");
          setIsSubmitting(false);
          return;
        }

        await createProduct(formData);
        message.success("Tạo sản phẩm thành công");
      } else {
        await updateProduct(editingProduct._id, formData);
        message.success("Cập nhật sản phẩm thành công");
      }

      resetModalState();
      fetchProducts();
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.message || "Thao tác sản phẩm thất bại",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <Image
            src={image}
            alt="product"
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          <span>Không có ảnh</span>
        ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "nameProduct",
      key: "nameProduct",
    },
    {
      title: "Giá",
      dataIndex: "priceProduct",
      key: "priceProduct",
      render: (price) => `${Number(price || 0).toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Giảm giá",
      dataIndex: "discountProduct",
      key: "discountProduct",
      render: (discount) => `${discount || 0}%`,
    },
    {
      title: "Tồn kho",
      dataIndex: "stockProduct",
      key: "stockProduct",
      render: (stock) => (
        <Tag color={stock > 0 ? "green" : "red"}>
          {stock > 0 ? `${stock} sản phẩm` : "Hết hàng"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái hiển thị",
      dataIndex: "isHidden",
      key: "isHidden",
      render: (isHidden) => (
        <Tag color={isHidden ? "volcano" : "blue"}>
          {isHidden ? "Đã ẩn" : "Đang hiển thị"}
        </Tag>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "descriptionProduct",
      key: "descriptionProduct",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc muốn xóa sản phẩm này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Flex gap="middle" vertical>
      <Flex align="center" justify="space-between">
        <h2>Quản lý sản phẩm</h2>
        <Space>
          <Button onClick={fetchProducts} loading={loading}>
            Tải lại
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Thêm sản phẩm
          </Button>
        </Space>
      </Flex>

      {selectedRowKeys.length > 0 ? (
        <div>Đã chọn {selectedRowKeys.length} sản phẩm</div>
      ) : null}

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        open={isModalOpen}
        onCancel={resetModalState}
        onOk={handleSubmit}
        confirmLoading={isSubmitting}
        width={800}
        okText={editingProduct ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="nameProduct"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Flex gap="middle">
            <Form.Item
              label="Giá sản phẩm"
              name="priceProduct"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm" },
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="Nhập giá"
              />
            </Form.Item>

            <Form.Item
              label="Giảm giá (%)"
              name="discountProduct"
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                max={100}
                placeholder="Nhập giảm giá"
              />
            </Form.Item>

            <Form.Item
              label="Tồn kho"
              name="stockProduct"
              rules={[{ required: true, message: "Vui lòng nhập tồn kho" }]}
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="Nhập tồn kho"
              />
            </Form.Item>
          </Flex>

          <Form.Item
            label="Danh mục"
            name="categoryProduct"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select
              placeholder="Chọn danh mục"
              showSearch
              optionFilterProp="label"
              options={categories.map((category) => ({
                value: category._id,
                label: category.nameCategory,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Mô tả sản phẩm"
            name="descriptionProduct"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Ẩn sản phẩm"
            name="isHidden"
            valuePropName="checked"
          >
            <Switch checkedChildren="Ẩn" unCheckedChildren="Hiện" />
          </Form.Item>

          {editingProduct && oldImages.length > 0 && (
            <Form.Item label="Ảnh hiện tại">
              <Space wrap>
                {oldImages.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      border: "1px solid #f0f0f0",
                      padding: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Image
                      src={img}
                      alt={`old-${index}`}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                    <Button
                      danger
                      size="small"
                      style={{ marginTop: 6, width: "100%" }}
                      onClick={() =>
                        setOldImages((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                    >
                      Xóa ảnh cũ
                    </Button>
                  </div>
                ))}
              </Space>
            </Form.Item>
          )}

          <Form.Item label={editingProduct ? "Thêm ảnh mới" : "Ảnh sản phẩm"}>
            <Upload
              multiple
              listType="picture-card"
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  setCropImage(reader.result);
                  setCropOpen(true);
                };
                return false;
              }}
              fileList={newImages}
              onRemove={(file) => {
                setNewImages(prev => prev.filter(f => f.uid !== file.uid));
              }}
            >
              {newImages.length >= 5 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh</div>
                </div>
              )}
            </Upload>
            {cropOpen && cropImage && (
              <ImageCropper
                imageSrc={cropImage}
                open={cropOpen}
                onCancel={() => { setCropOpen(false); setCropImage(null); }}
                onCropComplete={(croppedFile) => {
                  croppedFile.uid = Date.now();
                  setNewImages(prev => [...prev, croppedFile]);
                  setCropOpen(false);
                  setCropImage(null);
                }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default TableProduct;
