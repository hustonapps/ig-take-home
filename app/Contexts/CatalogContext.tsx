"use client";

import catalogData from "@/app/data.json";
import { createContext, useEffect, useMemo, useContext, useState } from "react";
import { Catalog } from "@/app/models/Catalog";

export const CatalogContext = createContext<{
  catalog: Catalog | null;
}>({
  catalog: null,
});

export const CatalogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  useEffect(() => {
    setCatalog(new Catalog(catalogData));
  }, []);

  const value = useMemo(() => ({ catalog }), [catalog]);

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
};
