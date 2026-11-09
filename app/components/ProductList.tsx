"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useMapProductToProductDisplay } from "@/app/hooks/useMapProductToProductDisplay";
import type { Product } from "@/app/models/Product";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  const [showFullData, setShowFullData] = useState(false);
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

  const onToggleShowFullData = useCallback(() => {
    setShowFullData((prev) => !prev);
  }, []);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      {products.map((product) => {
        return (
          <Card
            key={product.key}
            className="h-full min-h-0 overflow-hidden p-2"
          >
            <CardHeader className="shrink-0">
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{competitorName}</CardDescription>
            </CardHeader>
            <div className="min-h-6 flex-1 overflow-auto">
              <CardContent>
                <div className="relative mx-auto size-36">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {product.variants.map((variant) => {
                    return (
                      <ProductLineItem key={variant.id} variant={variant} />
                    );
                  })}
                </div>
              </CardContent>
              {showFullData && (
                <>
                  <Separator />
                  <pre className="w-max min-w-full px-(--card-spacing) pb-2 text-xs">
                    {JSON.stringify(product, null, 2)}
                  </pre>
                </>
              )}
            </div>
            <CardFooter className="shrink-0">
              <Button onClick={onToggleShowFullData} className="w-full">
                {showFullData ? "Show Variants Only" : "Show All Data"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
