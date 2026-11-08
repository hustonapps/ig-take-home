"use client";

import { useMemo } from "react";
import { useMapProductToProductDisplay } from "@/app/hooks/useMapProductToProductDisplay";
import type { Product } from "@/app/models/Catalog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductLineItem } from "@/app/components/ProductLineItem";

interface Props {
  data: Product[];
  category: string;
  competitorKey: string;
  competitorName: string;
}

export const ProductList = ({
  data = [],
  category = "",
  competitorKey,
  competitorName,
}: Props) => {
  const competitorProductMappers = useMapProductToProductDisplay();

  const mapFn = useMemo(() => {
    const fn =
      competitorProductMappers[
        competitorKey as keyof typeof competitorProductMappers
      ];

    if (!fn) {
      throw new Error(
        `No product mapper found for competitor: ${competitorKey}`,
      );
    }

    return fn;
  }, [competitorProductMappers, competitorKey]);

  const products = useMemo(() => {
    return data.filter((product) => product.category === category).map(mapFn);
  }, [data, category, mapFn]);

  return (
    <div className="w-full">
      {products.map((product) => {
        return (
          <Card key={product.key} className="p-2">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{competitorName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {product.variants.map((variant) => {
                  return <ProductLineItem key={variant.id} variant={variant} />;
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
