import { useEffect, useMemo, useState } from "react";
import { Menu, Spin, Input, Select, Slider, Rate, Button, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./shop.css";
import {
  listProduct,
  listProductByCategory,
} from "../../config/ProductRequest";
import { listCategory } from "../../config/CategoryRequest";
import { requestAddToCart } from "../../config/CartRequest";

const { Option } = Select;

function Shop() {
  const handleAddToCart = async (productId) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        message.info("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        navigate("/login");
        return;
      }
      await requestAddToCart({ productId, quantity: 1 });
      message.success("Đã thêm vào giỏ hàng!");
      window.dispatchEvent(new Event("cartChanged"));
    } catch (error) {
      message.error(error?.response?.data?.message || "Thêm thất bại");
    }
  };

  const navigate = useNavigate();
  const [dataCategory, setDataCategory] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 5000000]);

  const fetchCategory = async () => {
    const res = await listCategory();
    setDataCategory(res.metadata || []);
  };

  const fetchProduct = async () => {
    const res = await listProduct();
    const products = res.metadata || [];
    setDataProduct(products.filter((item) => item.isHidden === false));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchCategory();
        await fetchProduct();
      } catch (error) {
        console.error("Failed to load shop data:", error);
        setDataCategory([]);
        setDataProduct([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    const run = async () => {
      setLoading(true);
      try {
        if (selectedCategory === "all") {
          const res = await listProduct();
          setDataProduct(
            (res.metadata || []).filter((item) => item.isHidden === false),
          );
        } else {
          const res = await listProductByCategory(selectedCategory);
          setDataProduct(
            (res.metadata || []).filter((item) => item.isHidden === false),
          );
        }
      } catch (e) {
        console.error(e);
        setDataProduct([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [selectedCategory]);

  const menuItems = useMemo(() => {
    return [
      {
        key: "all",
        icon: <AppstoreOutlined />,
        label: "Tất cả sản phẩm",
      },
      ...dataCategory.map((category) => ({
        key: category._id,
        label: category.nameCategory,
        icon: category.imageCategory ? (
          <img loading="lazy" src={category.imageCategory} alt="" className="shop__catIcon" />
        ) : (
          <AppstoreOutlined />
        ),
      })),
    ];
  }, [dataCategory]);

  const viewProducts = useMemo(() => {
    const normalizedQ = q.trim().toLowerCase();
    let arr = [...dataProduct];

    if (normalizedQ) {
      arr = arr.filter((p) => {
        const name = (p.nameProduct || "").toLowerCase();
        const desc = (p.descriptionProduct || "").toLowerCase();
        return name.includes(normalizedQ) || desc.includes(normalizedQ);
      });
    }

    arr = arr.filter((p) => {
      const price = Number(p.priceProduct || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (sort === "price_asc") {
      arr.sort(
        (a, b) => Number(a.priceProduct || 0) - Number(b.priceProduct || 0),
      );
    } else if (sort === "price_desc") {
      arr.sort(
        (a, b) => Number(b.priceProduct || 0) - Number(a.priceProduct || 0),
      );
    } else {
      arr.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
    }

    return arr;
  }, [dataProduct, q, sort, priceRange]);

  const selectedCategoryName =
    selectedCategory === "all"
      ? "Bộ sưu tập trà"
      : dataCategory.find((c) => c._id === selectedCategory)?.nameCategory ||
        "Sản phẩm";

  const handleReset = () => {
    setQ("");
    setPriceRange([0, 5000000]);
    setSort("newest");
    setSelectedCategory("all");
  };

  const getTeaBadge = (item) => {
    const name = (item.nameProduct || "").toLowerCase();
    const desc = (item.descriptionProduct || "").toLowerCase();
    const content = `${name} ${desc}`;

    if (content.includes("matcha")) return "Matcha tuyển chọn";
    if (content.includes("thảo mộc") || content.includes("ngâm chân"))
      return "Thảo mộc thư giãn";
    if (content.includes("combo")) return "Quà tặng tinh tuyển";
    return "Lá trà nguyên bản";
  };

  return (
    <div className="container">
      <div className="shopWrap">
        <div className="shopContainer">
          <aside className="shopSidebar">

            <div className="shopBox shopBrandBox">
              <div className="shopBoxTitle">
                <span className="leaf" /> Cửa hàng nhà MediTea
              </div>
              <div className="shopIntro">
                Nơi tuyển chọn những dòng trà thanh vị, dịu hương và gần gũi với
                nhịp sống hằng ngày.
              </div>
            </div>

            <div className="shopBox">
              <div className="shopBoxTitle">
                <span className="leaf" /> Danh mục trà
              </div>
              <div className="shopBoxBody">
                <Menu
                  mode="inline"
                  selectedKeys={[selectedCategory || "all"]}
                  items={menuItems}
                  onClick={({ key }) => setSelectedCategory(key)}
                  className="shopMenu"
                />
              </div>
            </div>

            <div className="shopBox">
              <div className="shopBoxTitle">
                <span className="leaf" /> Chọn mức giá
              </div>
              <div className="shopBoxBody">
                <div className="shopFilterRow">
                  <div className="shopFilterPrice">
                    {priceRange[0].toLocaleString()}đ —{" "}
                    {priceRange[1].toLocaleString()}đ
                  </div>

                  <Slider
                    range
                    value={priceRange}
                    onChange={setPriceRange}
                    min={0}
                    max={5000000}
                    step={50000}
                    tooltip={{ open: false }}
                    className="shopSlider"
                  />

                  <Button className="shopBtn" onClick={handleReset}>
                    Đặt lại
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          <main className="shopMain">
            <div className="shopTopbar">
              <div className="shopHeadline">
                <div className="shopEyebrow">MediTea Collection</div>
                <div className="shopH1">{selectedCategoryName}</div>
                <div className="shopSub">
                  Hiển thị {viewProducts.length} sản phẩm dành cho trải nghiệm
                  thưởng trà nhẹ nhàng và tinh chọn
                </div>
              </div>

              <div className="shopControls">
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  prefix={<SearchOutlined />}
                  placeholder="Tìm trà, matcha, quà tặng..."
                  allowClear
                  className="shopSearch"
                />
                <Select value={sort} onChange={setSort} className="shopSort">
                  <Option value="newest">Sắp xếp mặc định</Option>
                  <Option value="price_asc">Giá nhỏ tới lớn</Option>
                  <Option value="price_desc">Giá từ lớn tới nhỏ</Option>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="shopLoading">
                <Spin size="large" tip="Đang tải sản phẩm..." />
              </div>
            ) : viewProducts.length > 0 ? (
              <div className="shopGrid">
                {viewProducts.map((item) => {
                  const price = Number(item.priceProduct || 0);
                  const img =
                    item.imagesProduct?.[0] ||
                    "https://via.placeholder.com/700x700?text=No+Image";

                  return (
                    <div key={item._id} className="shopCard">
                      {/* <div className="shopCardBadge">{getTeaBadge(item)}</div> */}

                      <div
                        className="shopCardImg"
                        onClick={() => navigate(`/product/${item._id}`)}
                      >
                        <img src={img} alt={item.nameProduct} loading="lazy" />
                      </div>

                      <div className="shopCardBody">
                        <Rate disabled defaultValue={4} className="shopStars" />

                        <div
                          className="shopCardTitle"
                          onClick={() => navigate(`/product/${item._id}`)}
                        >
                          {item.nameProduct}
                        </div>

                        <div className="shopCardDesc">
                          {item.descriptionProduct ||
                            "Hương vị dịu nhẹ, phù hợp cho những phút thư giãn và chăm sóc bản thân mỗi ngày."}
                        </div>

                        <div className="shopCardBottom">
                          <div className="shopPrice">
                            {price.toLocaleString()}đ
                          </div>

                          <Button
                            className="shopAdd"
                            icon={<ShoppingCartOutlined />}
                            title="Thêm vào giỏ"
                            onClick={() => handleAddToCart(item._id)}
                          >
                            Thêm
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="shopEmpty">
                <div className="shopEmptyIcon">🍃</div>
                <div className="shopEmptyTitle">
                  Chưa tìm thấy sản phẩm phù hợp
                </div>
                <div className="shopEmptySub">
                  Hãy thử đổi danh mục hoặc điều chỉnh mức giá để khám phá thêm
                  các dòng trà khác.
                </div>
                <Button onClick={handleReset}>Đặt lại bộ lọc</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Shop;
