import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  InputNumber,
  Tag,
  Breadcrumb,
  Image,
  Spin,
  Descriptions,
  Divider,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  HomeOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { productDetail } from "../../config/ProductRequest";
import { requestAddToCart } from "../../config/CartRequest";
import { listCategory } from "../../config/CategoryRequest";
import "./productDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await listCategory();
      setCategories(res?.metadata || []);
    } catch (error) {
      console.log("LOAD CATEGORY ERROR =", error);
      setCategories([]);
    }
  };

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const res = await productDetail(id);
      if (res?.metadata) {
        setProduct(res.metadata);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.log(error);
      message.error("Không tải được chi tiết sản phẩm");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      await Promise.all([fetchProductDetail(), fetchCategories()]);
    };

    run();
  }, [id]);

  const handleIncrease = () => {
    const stock = Number(product?.stockProduct || 1);
    setQuantity((prev) => (prev < stock ? prev + 1 : prev));
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!product?._id) {
      message.error("Không tìm thấy sản phẩm");
      return;
    }

    try {
      setAdding(true);

      const body = {
        productId: product._id,
        quantity,
      };

      await requestAddToCart(body);

      message.success("Thêm vào giỏ hàng thành công");
      window.dispatchEvent(new Event("cartChanged"));
      navigate("/cart");
    } catch (error) {
      console.log(error);
      message.error("Vui lòng đăng nhập để thực hiện chức năng này");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product?._id) {
      message.error("Không tìm thấy sản phẩm");
      return;
    }
    try {
      const body = { productId: product._id, quantity: 1 };
      await requestAddToCart(body);
      window.dispatchEvent(new Event("cartChanged"));
      navigate('/checkout');
    } catch (error) {
      if (error?.response?.status === 401) {
        message.error("Vui lòng đăng nhập để mua hàng");
      } else {
        message.error(error?.response?.data?.message || "Thêm vào giỏ thất bại");
      }
    }
  };

  const categoryName = useMemo(() => {
    if (!product?.categoryProduct) return "Chưa có danh mục";

    const found = categories.find(
      (item) => item._id === product.categoryProduct,
    );

    return found?.nameCategory || "Chưa có danh mục";
  }, [categories, product]);

  if (loading) {
    return (
      <div className="productDetailLoading">
        <Spin size="large" tip="Đang tải chi tiết sản phẩm..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="productDetailEmpty">
        <h2>Không tìm thấy sản phẩm</h2>
        <Button type="primary" onClick={() => navigate("/shop")}>
          Quay lại shop
        </Button>
      </div>
    );
  }

  const images =
    Array.isArray(product.imagesProduct) && product.imagesProduct.length > 0
      ? product.imagesProduct
      : ["https://via.placeholder.com/700x700?text=No+Image"];

  const currentImage = images[selectedImage] || images[0];
  const price = Number(product.priceProduct || 0);

  return (
    <div className="productDetailWrapper">
      <div className="productDetailContainer">
        <div className="productDetailWrap">



          <div className="productDetailHero">
            <div className="productDetailMain">
              <div className="productDetailGallery">
                <div className="productDetailMainImage">
                  <Image
                    src={currentImage}
                    alt={product.nameProduct}
                    className="productDetailImageTag"
                  />
                </div>

                <div className="productDetailThumbs">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`productDetailThumb ${
                        selectedImage === index ? "active" : ""
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img loading="lazy" src={img} alt={`thumb-${index}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="productDetailInfo">
                <div className="productDetailEyebrow">MediTea </div>

                <h1 className="productDetailTitle">{product.nameProduct}</h1>

                <div className="productDetailPrice">
                  {price.toLocaleString("vi-VN")}đ
                </div>

                <div className="productDetailDesc">
                  {product.descriptionProduct ||
                    "Dòng trà được tuyển chọn với hương vị nhẹ nhàng, thanh sạch và phù hợp cho những khoảnh khắc thư giãn mỗi ngày."}
                </div>

                <div className="productDetailMeta">
                  <Tag color="green">
                    {Number(product.stockProduct) > 0 ? "Còn hàng" : "Hết hàng"}
                  </Tag>
                  <Tag color="blue">{categoryName}</Tag>
                </div>

                <div className="productDetailNote">
                  Gợi mở cảm giác mộc, thanh và dịu vị — phù hợp để thưởng trà
                  mỗi ngày hoặc làm quà tặng tinh tế.
                </div>

                <div className="productDetailQuantity">
                  <span className="productDetailQuantityLabel">Số lượng</span>
                  <div className="productDetailQtyControls">
                    <div className="productDetailQtyBox">
                      <Button icon={<MinusOutlined />} onClick={handleDecrease} />
                      <InputNumber
                        min={1}
                        max={Number(product.stockProduct || 1)}
                        value={quantity}
                        onChange={(value) => setQuantity(value || 1)}
                      />
                      <Button icon={<PlusOutlined />} onClick={handleIncrease} />
                    </div>
                  </div>
                </div>

                <div className="productDetailActions">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    loading={adding}
                    disabled={Number(product.stockProduct || 0) <= 0}
                    className="productDetailCartBtn"
                  >
                    Thêm vào giỏ hàng
                  </Button>

                  <Button
                    type="primary"
                    size="large"
                    onClick={handleBuyNow}
                    className="productDetailCartBtn"
                    style={{ backgroundColor: '#7ca844', borderColor: '#7ca844' }}
                  >
                    Mua ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Divider className="productDetailDivider" />

          <div className="productDetailExtra">
            <Descriptions
              title="Thông tin sản phẩm"
              bordered
              column={1}
              size="middle"
            >
              <Descriptions.Item label="Tên sản phẩm">
                {product.nameProduct || "—"}
              </Descriptions.Item>

              <Descriptions.Item label="Giá">
                {price.toLocaleString("vi-VN")}đ
              </Descriptions.Item>

              <Descriptions.Item label="Mô tả">
                {product.descriptionProduct || "Chưa có mô tả"}
              </Descriptions.Item>

              <Descriptions.Item label="Danh mục">
                {categoryName}
              </Descriptions.Item>


            </Descriptions>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
