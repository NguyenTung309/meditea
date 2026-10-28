import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Spin, Tabs, Divider, Row, Col, Upload } from "antd";
import { SaveOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllContent, updateContent, uploadImage } from "../../../config/ContentRequest";
import ContentPreview from "./ContentPreview";
import ImageUploadField from "./ImageUploadField";

const { TextArea } = Input;

const IMAGE_FIELDS = new Set(["image", "image2", "image3"]);

const sectionsConfig = [
  {
    key: "hero",
    label: "Hero (Slide đầu trang)",
    fields: ["title", "text", "image"],
    fieldLabels: { image: "Video nền (.mp4 URL)" },
  },
  {
    key: "story",
    label: "Câu chuyện MediTEA",
    fields: ["title", "text", "image", "image2", "image3"],
    fieldLabels: {
      image:  "Ảnh 1 (trên trái)",
      image2: "Ảnh 2 (phải, dọc)",
      image3: "Ảnh 3 (dưới trái)",
    },
  },
  {
    key: "values",
    label: "Giá trị nguyên bản",
    fields: ["title", "text"],
    hasSteps: true,
  },
  {
    key: "tea_collection",
    label: "Bộ Sưu Tập Trà",
    fields: ["title", "text", "image", "image2", "image3"],
    fieldLabels: {
      image:  "Ảnh sản phẩm 1",
      image2: "Ảnh sản phẩm 2",
      image3: "Ảnh sản phẩm 3",
    },
    hasTeaCards: true,
  },
  {
    key: "core_values",
    label: "Lá trà già nguyên bản",
    fields: ["title", "text", "image", "image2"],
    fieldLabels: {
      image:  "Ảnh lớn (dưới)",
      image2: "Ảnh nhỏ (trên)",
    },
    hasItems: true,
  },
  {
    key: "experience",
    label: "Trải nghiệm",
    fields: ["title", "text", "image"],
  },
  {
    key: "commitment",
    label: "Chứng nhận chất lượng",
    fields: ["title", "text", "image"],
  },
  {
    key: "footer",
    label: "Footer",
    fields: ["address", "phone", "contact_email", "business_name", "business_reg", "reg_date", "reg_place"],
    hasFooterSocials: true,
    hasFooterNav: true,
  },
];

const globalFieldLabels = {
  title:         "Tiêu đề",
  text:          "Nội dung",
  image:         "Hình ảnh 1",
  image2:        "Hình ảnh 2",
  image3:        "Hình ảnh 3",
  subtext:       "Phụ đề",
  address:       "Địa chỉ",
  phone:         "Số điện thoại",
  contact_email: "Email liên hệ",
  business_name: "Tên công ty",
  business_reg:  "Số đăng ký doanh nghiệp",
  reg_date:      "Ngày đăng ký lần đầu",
  reg_place:     "Nơi cấp",
};

const defaultSteps = Array(6).fill(null).map(() => ({ title: "", desc: "", icon: "", img: "", imgs: [] }));
const defaultItems = Array(4).fill(null).map((_, i) => ({ num: String(i + 1), text: "" }));
const defaultTeaSteps = [
  { title: "Trà lá già Bản lẻ 100g", desc: "Trà lá già MediTea – Bản lẻ 100g", icon: "Dòng sản phẩm cốt lõi.", img: "", imgs: [] },
  { title: "Gift Set Trà & Trải nghiệm", desc: "Gift Set MediTea – Trà & Trải nghiệm", icon: "Dòng quà tặng kết hợp.", img: "", imgs: [] },
  { title: "Trà lá già Bản sỉ 500g", desc: "Trà lá già MediTea – Bản sỉ 500g", icon: "Dành cho doanh nghiệp.", img: "", imgs: [] },
];

const sectionDefaults = {
  tea_collection: {
    title: "Bộ Sưu Tập Trà",
    text: "Không phải lá non hái sớm. MediTea chọn lá trà 1–3 năm tuổi từ vùng cao.",
    image: "https://images.meditea.vn/images/sp1.png",
    image2: "https://images.meditea.vn/images/sp3.png",
    image3: "https://images.meditea.vn/images/sp2.png",
  },
};


const defaultFooterSocials = [
  { num: "facebook",  text: "" },
  { num: "instagram", text: "" },
  { num: "youtube",   text: "" },
  { num: "zalo",      text: "" },
];

const defaultFooterNav = [
  { title: "Liên hệ",                 desc: "/contact", icon: "", img: "" },
  { title: "Tư liệu truyền thông",    desc: "/media",   icon: "", img: "" },
  { title: "Chính sách bảo mật",      desc: "/privacy", icon: "", img: "" },
  { title: "Điều khoản và điều kiện", desc: "/terms",   icon: "", img: "" },
  { title: "Blog",                    desc: "/blog",    icon: "", img: "" },
  { title: "Câu hỏi thường gặp",      desc: "/faq",     icon: "", img: "" },
];

const applyDefaults = (vals, key) => {
  if (key === "footer") {
    if (!vals.steps || vals.steps.length === 0) vals.steps = defaultFooterNav;
    if (!vals.items || vals.items.length === 0) vals.items = defaultFooterSocials;
  } else if (key === "tea_collection") {
    if (!vals.steps || vals.steps.length === 0) vals.steps = defaultTeaSteps;
  } else {
    if (!vals.steps || vals.steps.length === 0) vals.steps = defaultSteps;
    if (!vals.items || vals.items.length === 0) vals.items = defaultItems;
  }
  // For values section: ensure each step has imgs array (migrate from single img if needed)
  if (key === "values" && vals.steps) {
    vals.steps = vals.steps.map(step => ({
      ...step,
      imgs: (step.imgs && step.imgs.length > 0) ? step.imgs : (step.img ? [step.img] : []),
    }));
  }
};

// Inline multi-image field for values steps — uploads immediately on file select
function ImgArrayField({ value = [], onChange, maxCount = 4 }) {
  const [uploading, setUploading] = useState({});
  const [previews, setPreviews] = useState({});

  const handleAdd = () => {
    if ((value?.length || 0) < maxCount) onChange?.([...(value || []), ""]);
  };

  const handleRemove = (idx) => {
    onChange?.((value || []).filter((_, i) => i !== idx));
    setPreviews(p => { const n = { ...p }; delete n[idx]; return n; });
  };

  const handleFileChange = async (idx, file) => {
    const blob = URL.createObjectURL(file);
    setPreviews(p => ({ ...p, [idx]: blob }));
    setUploading(p => ({ ...p, [idx]: true }));
    try {
      const res = await uploadImage(file);
      const url = res?.metadata?.url;
      if (url) {
        const next = [...(value || [])];
        next[idx] = url;
        onChange?.(next);
        URL.revokeObjectURL(blob);
        setPreviews(p => { const n = { ...p }; delete n[idx]; return n; });
      }
    } catch {
      message.error("Upload ảnh thất bại");
    } finally {
      setUploading(p => { const n = { ...p }; delete n[idx]; return n; });
    }
  };

  const items = value || [];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
      {items.map((url, idx) => {
        const src = previews[idx] || url;
        const busy = uploading[idx];
        return (
          <div key={idx} style={{ position: "relative" }}>
            <div style={{ width: 88, height: 66, borderRadius: 8, overflow: "hidden", border: "1px solid #f0f0f0", background: "#f5f5f5", position: "relative" }}>
              {src
                ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: busy ? 0.4 : 1 }} onError={(e) => { e.target.style.opacity = 0.2; }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 11 }}>Trống</div>
              }
              {busy && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#666" }}>...</div>}
            </div>
            <Upload accept="image/*" showUploadList={false} beforeUpload={() => false}
              onChange={({ fileList }) => {
                const f = fileList[fileList.length - 1]?.originFileObj;
                if (f) handleFileChange(idx, f);
              }}>
              <Button size="small" style={{ marginTop: 4, width: 88, fontSize: 11 }}>Đổi ảnh</Button>
            </Upload>
            {items.length > 1 && (
              <button onClick={() => handleRemove(idx)}
                style={{ position: "absolute", top: -6, right: -6, background: "#ff4d4f", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                ×
              </button>
            )}
          </div>
        );
      })}
      {items.length < maxCount && (
        <button onClick={handleAdd}
          style={{ width: 88, height: 66, borderRadius: 8, border: "2px dashed #d9d9d9", background: "#fafafa", cursor: "pointer", fontSize: 22, color: "#bbb", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PlusOutlined />
        </button>
      )}
    </div>
  );
}

const ManageContent = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeKey, setActiveKey] = useState("hero");
  const [pendingFiles, setPendingFiles] = useState({});
  const [saveCount, setSaveCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllContent();
      const items = res?.metadata || [];
      const map = {};
      items.forEach((item) => { map[item.key] = item; });
      setData(map);
      if (map[activeKey]) {
        const vals = { ...map[activeKey] };
        delete vals._id; delete vals.key; delete vals.updatedAt; delete vals.createdAt; delete vals.__v;
        applyDefaults(vals, activeKey);
        form.setFieldsValue(vals);
      } else if (sectionDefaults[activeKey]) {
        const vals = { ...sectionDefaults[activeKey] };
        applyDefaults(vals, activeKey);
        form.setFieldsValue(vals);
      }
    } catch {
      message.error("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onTabChange = (key) => {
    setActiveKey(key);
    setPendingFiles({});
    if (data[key]) {
      const vals = { ...data[key] };
      delete vals._id; delete vals.key; delete vals.updatedAt; delete vals.createdAt; delete vals.__v;
      applyDefaults(vals, key);
      form.setFieldsValue(vals);
    } else if (sectionDefaults[key]) {
      const vals = { ...sectionDefaults[key] };
      applyDefaults(vals, key);
      form.setFieldsValue(vals);
    } else {
      form.resetFields();
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (Object.keys(pendingFiles).length > 0) {
        for (const [fieldPath, file] of Object.entries(pendingFiles)) {
          const res = await uploadImage(file);
          const url = res?.metadata?.url;
          if (url) {
            const parsed = fieldPath.startsWith("[") ? JSON.parse(fieldPath) : fieldPath;
            form.setFieldValue(parsed, url);
          }
        }
        setPendingFiles({});
      }

      const values = await form.validateFields();
      await updateContent(activeKey, values);
      message.success("Lưu thành công!");
      await fetchData();
      setSaveCount(c => c + 1);
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const watchedValues = Form.useWatch([], form);

  if (loading) return <Spin />;

  const currentSection = sectionsConfig.find((s) => s.key === activeKey);

  const getLabel = (field) =>
    currentSection?.fieldLabels?.[field] || globalFieldLabels[field] || field;

  // reactKey: string for React key; formName: field name for Form.Item; label: display label
  const renderImageField = (reactKey, formName, label) => {
    const pathStr = JSON.stringify(formName);
    const pendingKey = Array.isArray(formName) ? pathStr : formName;
    return (
      <Form.Item key={reactKey} label={label}>
        <Form.Item name={formName} noStyle>
          <ImageUploadField
            key={`${pendingKey}-${saveCount}`}
            onFileSelected={(file) => setPendingFiles(p => ({ ...p, [pendingKey]: file }))}
            onClearFile={() => setPendingFiles(p => { const n = { ...p }; delete n[pendingKey]; return n; })}
          />
        </Form.Item>
      </Form.Item>
    );
  };

  return (
    <Row gutter={20} align="top">
      <Col xs={24} xl={14}>
        <Card
          title={<span><EditOutlined style={{ marginRight: 8 }} /> Quản lý nội dung trang</span>}
          extra={
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
              Lưu thay đổi
            </Button>
          }
          bordered={false}
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 12 }}
        >
          <Tabs activeKey={activeKey} onChange={onTabChange} items={sectionsConfig.map((s) => ({
            key: s.key,
            label: s.label,
          }))} />

          <Divider />

          <Form form={form} layout="vertical" requiredMark={false}>
            {/* Regular fields */}
            {currentSection?.fields.map((field) => {
              if (IMAGE_FIELDS.has(field)) {
                return renderImageField(field, field, getLabel(field));
              }
              return (
                <Form.Item key={field} label={getLabel(field)} name={field}>
                  {field === "text"
                    ? <TextArea rows={4} placeholder={getLabel(field)} />
                    : <Input placeholder={getLabel(field)} />
                  }
                </Form.Item>
              );
            })}

            {/* Steps editor for Gia Tri Nguyen Ban */}
            {currentSection?.hasSteps && (
              <>
                <Divider>6 bước Giá trị nguyên bản</Divider>
                {[0,1,2,3,4,5].map((idx) => (
                  <div key={idx} style={{
                    background: "#fafaf7", borderRadius: 12, padding: 16, marginBottom: 16,
                    border: "1px solid #f0f0f0"
                  }}>
                    <h4 style={{ margin: "0 0 12px", color: "#5a8a2e" }}>Bước {idx + 1}</h4>
                    <Row gutter={12}>
                      <Col span={16}>
                        <Form.Item label="Tiêu đề" name={["steps", idx, "title"]}>
                          <Input placeholder="Tiêu đề bước" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Icon (emoji)" name={["steps", idx, "icon"]}>
                          <Input placeholder="🌿" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item label="Ảnh (tối đa 4, upload ngay khi chọn)">
                      <Form.Item name={["steps", idx, "imgs"]} noStyle>
                        <ImgArrayField maxCount={4} />
                      </Form.Item>
                    </Form.Item>
                    <Form.Item label="Mô tả" name={["steps", idx, "desc"]}>
                      <TextArea rows={2} placeholder="Nội dung mô tả" />
                    </Form.Item>
                  </div>
                ))}
              </>
            )}

            {/* Tea Cards editor for Bo Luu Tap Tra */}
            {currentSection?.hasTeaCards && (
              <>
                <Divider>3 san pham trong Bo Luu Tap Tra</Divider>
                {[0,1,2].map((idx) => (
                  <div key={idx} style={{
                    background: "#fafaf7", borderRadius: 12, padding: 16, marginBottom: 16,
                    border: "1px solid #f0f0f0"
                  }}>
                    <h4 style={{ margin: "0 0 12px", color: "#5a8a2e" }}>San pham {idx + 1}</h4>
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item label="Title duoi anh" name={["steps", idx, "title"]}>
                          <Input placeholder="Ten san pham" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Title khi hover" name={["steps", idx, "desc"]}>
                          <Input placeholder="Title khi hover" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item label="Anh san pham">
                      <Form.Item name={["steps", idx, "img"]} noStyle>
                        <ImageUploadField
                          key={JSON.stringify(["steps",idx,"img"])+saveCount}
                          onFileSelected={(file) => setPendingFiles(p => ({ ...p, [JSON.stringify(["steps",idx,"img"])]: file }))}
                          onClearFile={() => setPendingFiles(p => { const n = {...p}; delete n[JSON.stringify(["steps",idx,"img"])]; return n; })}
                        />
                      </Form.Item>
                    </Form.Item>
                    <Form.Item label="Mo ta hover (p)" name={["steps", idx, "icon"]}>
                      <TextArea rows={3} placeholder="Noi dung mo ta khi hover" />
                    </Form.Item>
                  </div>
                ))}
              </>
            )}

            {/* Items editor for La tra gia nguyen ban */}
            {currentSection?.hasItems && (
              <>
                <Divider>4 mục giá trị</Divider>
                {[0,1,2,3].map((idx) => (
                  <div key={idx} style={{
                    background: "#fafaf7", borderRadius: 12, padding: 16, marginBottom: 16,
                    border: "1px solid #f0f0f0"
                  }}>
                    <h4 style={{ margin: "0 0 12px", color: "#5a8a2e" }}>Mục {idx + 1}</h4>
                    <Row gutter={12}>
                      <Col span={4}>
                        <Form.Item label="Số" name={["items", idx, "num"]}>
                          <Input placeholder={String(idx + 1)} />
                        </Form.Item>
                      </Col>
                      <Col span={20}>
                        <Form.Item label="Nội dung" name={["items", idx, "text"]}>
                          <Input placeholder="Nội dung" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}
              </>
            )}

            {/* Social media links editor for Footer */}
            {currentSection?.hasFooterSocials && (
              <>
                <Divider>Social Media Links</Divider>
                {["facebook", "instagram", "youtube", "zalo"].map((platform, idx) => (
                  <div key={platform} style={{
                    background: "#fafaf7", borderRadius: 12, padding: 16, marginBottom: 12,
                    border: "1px solid #f0f0f0"
                  }}>
                    <Row gutter={12} align="middle">
                      <Col span={5}>
                        <span style={{ fontWeight: 600, textTransform: "capitalize", color: "#555" }}>
                          {platform}
                        </span>
                        <Form.Item name={["items", idx, "num"]} hidden>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={19}>
                        <Form.Item label="URL" name={["items", idx, "text"]} style={{ marginBottom: 0 }}>
                          <Input placeholder={`https://${platform}.com/meditea`} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}
              </>
            )}

            {/* Navigation links editor for Footer */}
            {currentSection?.hasFooterNav && (
              <>
                <Divider>Navigation Links</Divider>
                {[0,1,2,3,4,5].map((idx) => (
                  <div key={idx} style={{
                    background: "#fafaf7", borderRadius: 12, padding: 16, marginBottom: 12,
                    border: "1px solid #f0f0f0"
                  }}>
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item label="Label" name={["steps", idx, "title"]}>
                          <Input placeholder="Tên link" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Route" name={["steps", idx, "desc"]}>
                          <Input placeholder="/contact" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}
              </>
            )}
          </Form>
        </Card>
      </Col>

      <Col xs={24} xl={10}>
        <Card
          title={<span><EyeOutlined style={{ marginRight: 8 }} /> Xem trước</span>}
          bordered={false}
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 12, position: "sticky", top: 80 }}
        >
          <ContentPreview sectionKey={activeKey} values={watchedValues || {}} />
        </Card>
      </Col>
    </Row>
  );
};

export default ManageContent;

