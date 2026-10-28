import { useState, useMemo, useCallback } from "react";
import { ingredients } from "../data/ingredients";
import {
  calculateCombinedFlavors,
  aggregateBenefits,
  checkSpecialCombos,
  getSuggestions,
  calculateHarmonyScore,
  analyzeWarnings,
} from "../data/mixRules";

const MAX_INGREDIENTS = 5;

/**
 * Custom hook quản lý toàn bộ state và logic của Tea Mixer game
 * Bao gồm cả warnings & side effects
 */
export function useTeaMixer() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // ─── Derived state ────────────────────────────────────
  const combinedFlavors = useMemo(
    () => calculateCombinedFlavors(selectedIngredients),
    [selectedIngredients]
  );

  const benefits = useMemo(
    () => aggregateBenefits(selectedIngredients),
    [selectedIngredients]
  );

  const specialCombos = useMemo(
    () => checkSpecialCombos(selectedIngredients),
    [selectedIngredients]
  );

  const suggestions = useMemo(
    () => getSuggestions(selectedIngredients, ingredients),
    [selectedIngredients]
  );

  const harmonyScore = useMemo(
    () => calculateHarmonyScore(selectedIngredients),
    [selectedIngredients]
  );

  // ⭐ MỚI: Warnings & side effects
  const analysis = useMemo(
    () => analyzeWarnings(selectedIngredients),
    [selectedIngredients]
  );

  // ─── Actions ──────────────────────────────────────────

  const addIngredient = useCallback(
    (ingredientId) => {
      if (selectedIngredients.length >= MAX_INGREDIENTS) return false;

      const ingredient = ingredients.find((ing) => ing.id === ingredientId);
      if (!ingredient) return false;

      if (selectedIngredients.some((ing) => ing.id === ingredientId)) return false;

      setSelectedIngredients((prev) => [...prev, ingredient]);
      return true;
    },
    [selectedIngredients]
  );

  const removeIngredient = useCallback((ingredientId) => {
    setSelectedIngredients((prev) =>
      prev.filter((ing) => ing.id !== ingredientId)
    );
  }, []);

  const resetMix = useCallback(() => {
    setSelectedIngredients([]);
  }, []);

  return {
    allIngredients: ingredients,
    selectedIngredients,
    maxIngredients: MAX_INGREDIENTS,

    combinedFlavors,
    benefits,
    specialCombos,
    suggestions,
    harmonyScore,

    // ⭐ MỚI
    warnings: analysis.warnings,
    sideEffects: analysis.sideEffects,
    totalCaffeine: analysis.totalCaffeine,

    addIngredient,
    removeIngredient,
    resetMix,
  };
}