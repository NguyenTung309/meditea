import React, { Suspense, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage, Html } from "@react-three/drei";
import { Button, Spin, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { MODELS_3D } from "../../data/models3d";

const { Title, Text } = Typography;

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function Product3DDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const modelData = MODELS_3D.find((m) => m.id === id);

  if (!modelData) {
    return (
      <div
        style={{ padding: "100px 5%", textAlign: "center", minHeight: "70vh" }}
      >
        <Title level={3}>Không tìm thấy sản phẩm 3D</Title>
        <Button type="primary" onClick={() => navigate("/3d-products")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const modelUrl = `https://images.meditea.vn/3D/${modelData.file}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 80px)",
        background: "#f5f5f5",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "15px 5%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          zIndex: 10,
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/3d-products")}
          type="text"
          style={{ marginRight: "15px" }}
        >
          Quay lại danh sách
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          {modelData.title}
        </Title>
      </div>

      {/* 3D Canvas Container */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense
            fallback={
              <Html center>
                <div style={{ textAlign: "center" }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 10 }}>Đang tải môi trường 3D...</div>
                </div>
              </Html>
            }
          >
            <Stage environment="city" intensity={0.5}>
              <Model url={modelUrl} />
            </Stage>
          </Suspense>
          <OrbitControls
            autoRotate
            autoRotateSpeed={2}
            enableZoom={true}
            makeDefault
          />
        </Canvas>

        {/* Overlay Info */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "0",
            right: "0",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "15px 25px",
              borderRadius: "12px",
              pointerEvents: "auto",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Text
              strong
              style={{
                fontSize: "16px",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Góc nhìn 360°
            </Text>
            <Text type="secondary">
              Dùng chuột để xoay & cuộn để thu phóng chi tiết
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
