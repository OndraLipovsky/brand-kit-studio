const STORAGE_KEY = "brand_kit_saved_history_v1";

export function getSavedBrands() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load brand history:", e);
    return [];
  }
}

export function saveBrandToHistory(brandData) {
  if (!brandData || !brandData.brandName) return;
  try {
    const history = getSavedBrands();
    const cleanEntry = {
      id: brandData.url || brandData.brandName,
      url: brandData.url,
      hostname: brandData.hostname || (brandData.url ? new URL(brandData.url).hostname : ""),
      brandName: brandData.brandName,
      tagline: brandData.tagline,
      logo: brandData.logo,
      primaryColor: brandData.palette?.find(c => c.role === "Primary Brand")?.hex || brandData.palette?.[0]?.hex || "#4f46e5",
      backgroundColor: brandData.palette?.find(c => c.role.includes("Background"))?.hex || "#ffffff",
      headingFont: brandData.typography?.headingFont,
      savedAt: new Date().toISOString(),
      fullData: brandData
    };

    // Filter out existing item with same url or name
    const updated = [cleanEntry, ...history.filter(h => h.id !== cleanEntry.id)].slice(0, 30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save brand to history:", e);
  }
}

export function deleteBrandFromHistory(id) {
  try {
    const history = getSavedBrands();
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to delete brand from history:", e);
    return [];
  }
}

export function clearBrandHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}