import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Modal, Slider, Button } from "antd";

const ASPECT = 1024 / 1536; // ~0.667

function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1536;
      const ctx = canvas.getContext("2d");
      
      const scaleX = image.naturalWidth / pixelCrop.width;
      const scaleY = image.naturalHeight / pixelCrop.height;
      
      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        1024,
        1536
      );
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "cropped-product.webp", { type: "image/webp" });
        resolve(file);
      }, "image/webp", 0.9);
    };
  });
}

const ImageCropper = ({ imageSrc, onCropComplete, onCancel, open }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((location) => setCrop(location), []);
  const onZoomChange = useCallback((zoom) => setZoom(zoom), []);
  const onCropAreaChange = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    const file = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(file);
  };

  return (
    <Modal
      title="Cắt ảnh (tỉ lệ 1024x1536)"
      open={open}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>Hủy</Button>,
        <Button key="crop" type="primary" onClick={handleCrop}>Cắt & Lưu</Button>,
      ]}
    >
      <div style={{ position: "relative", width: "100%", height: 400, background: "#333" }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={ASPECT}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropAreaChange}
        />
      </div>
      <div style={{ marginTop: 16 }}>
        <label>Zoom: {zoom.toFixed(1)}x</label>
        <Slider min={1} max={3} step={0.1} value={zoom} onChange={setZoom} />
      </div>
    </Modal>
  );
};

export default ImageCropper;
