"use client";

// import catalogData from "@/app/data.json"; // uncomment to use local data
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

  // uncomment for local data
  // useEffect(() => {
  //   setCatalog(new Catalog(catalogData));
  // }, []);

  useEffect(() => {
    const fetchCatalog = async () => {
      const catalogData = await fetch(
        "https://ig-mhuston-take-home.intelligems.io/data.json",
      );
      const data = await catalogData.json();
      setCatalog(new Catalog(data));
    };
    fetchCatalog();
  });

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
