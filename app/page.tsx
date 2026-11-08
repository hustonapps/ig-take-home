"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useCatalog } from "@/app/Contexts/CatalogContext";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CompetitorList } from "./components/CompetitorList";
import { CategoryList } from "./components/CategoryList";
import { ProductList } from "./components/ProductList";

export default function Home() {
  const { catalog } = useCatalog();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const productCategories = useMemo(() => {
    return catalog?.productCategories ?? [];
  }, [catalog?.productCategories]);

  useEffect(() => {
    if (productCategories?.length) {
      setSelectedCategory(productCategories[0]);
    }
  }, [productCategories]);

  const handleValueChange = useCallback((value: string | null) => {
    setSelectedCategory(value);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <main className=" flex flex-col container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Mott & Bow Price Analysis Tool</CardTitle>
            <CardDescription>
              Compare Competitor Pricing on Products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-bold">Competitors</h2>
                <CompetitorList data={catalog?.competitorList ?? []} />
              </div>
              <Separator />
              <div>
                <h2 className="text-lg font-bold">Product Categories</h2>
                <CategoryList
                  setSelectedValue={handleValueChange}
                  value={selectedCategory}
                  data={catalog?.productCategories}
                />
              </div>
            </div>
            <Separator />
            <div>
              <h2 className="text-lg font-bold">Competitor Products</h2>
              <div className="flex gap-4">
                {catalog?.competitorList.map((comp) => {
                  return (
                    <ProductList
                      key={comp.key}
                      competitorKey={comp.key}
                      competitorName={comp.name}
                      data={comp.products}
                      category={selectedCategory ?? ""}
                    />
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
