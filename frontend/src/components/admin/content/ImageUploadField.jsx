import React, { useState } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function ImageUploadField({ value, onChange, onFileSelected, onClearFile }) {
  const [localPreview, setLocalPreview] = useState(null);

  const handleFileChange = ({ fileList }) => {
    const file = fileList[0]?.originFileObj;
    if (!file) { setLocalPreview(null); onClearFile?.(); return; }
    const blob = URL.createObjectURL(file);
    setLocalPreview(blob);
    onFileSelected?.(file);
  };

  const previewSrc = localPreview || value;
  const isVideo = previewSrc && (previewSrc.endsWith(".mp4") || previewSrc.endsWith(".webm"));

  return (
    <div>
      {previewSrc ? (
        <div style={{ display: "inline-block", width: "100%", maxWidth: 280, marginBottom: 8 }}>
          {isVideo ? (
            <div style={{
              height: 110, background: "#1a2b12", borderRadius: 8,
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", color: "#aed98a", fontSize: 26,
              border: "1px solid #f0f0f0", gap: 6,
            }}>
              ▶
              <span style={{ fontSize: 11, opacity: 0.7 }}>Video</span>
            </div>
          ) : (
            <img
              src={previewSrc}
              alt="preview"
              style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, border: "1px solid #f0f0f0", display: "block" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}
        </div>
      ) : (
        <div style={{
          border: "2px dashed #d9d9d9", borderRadius: 8,
          padding: "18px 0", textAlign: "center", color: "#ccc",
          fontSize: 12, marginBottom: 8,
        }}>
          Chưa có ảnh
        </div>
      )}

      <Upload
        accept="image/*,video/mp4"
        showUploadList={false}
        maxCount={1}
        beforeUpload={() => false}
        onChange={handleFileChange}
      >
        <Button icon={<UploadOutlined />} size="small">
          {previewSrc ? "Đổi ảnh" : "Chọn ảnh"}
        </Button>
      </Upload>
    </div>
  );
}
