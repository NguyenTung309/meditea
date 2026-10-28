import { MODELS_3D } from "../data/models3d";

export function getProduct3DModelId(product) {
  if (!Array.isArray(MODELS_3D) || MODELS_3D.length === 0) {
    return null;
  }

  const explicitModelId = product?.model3dId;
  if (explicitModelId && MODELS_3D.some((model) => model.id === explicitModelId)) {
    return explicitModelId;
  }

  // Deterministic fallback so every product always maps to one 3D model.
  const seed = String(product?._id || product?.nameProduct || "");
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i)) % 2147483647;
  }

  const index = hash % MODELS_3D.length;
  return MODELS_3D[index].id;
}
