"use client";

import { useCallback } from "react";
import type { Product } from "@/app/models/Product";
import {
  type ProductDisplay,
  TrueClassicProductDisplay,
  MeUndiesProductDisplay,
  AdidasProductDisplay,
} from "@/app/models/ProductDisplay";

export const useMapProductToProductDisplay = () => {
  const mapTrueClassic = useCallback((product: Product): ProductDisplay => {
    return new TrueClassicProductDisplay(product);
  }, []);

  const mapMeUndies = useCallback((product: Product): ProductDisplay => {
    return new MeUndiesProductDisplay(product);
  }, []);

  const mapAdidas = useCallback((product: Product): ProductDisplay => {
    return new AdidasProductDisplay(product);
  }, []);

  const competitorProductMappers: Record<
    string,
    (product: Product) => ProductDisplay
  > = {
    trueClassic: mapTrueClassic,
    meUndies: mapMeUndies,
    adidas: mapAdidas,
  };

  return competitorProductMappers;
};
