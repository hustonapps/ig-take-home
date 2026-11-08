import type { ProductVariant } from "@/app/models/Catalog";

export const ProductLineItem = ({ variant }: { variant: ProductVariant }) => {
  return (
    <div className="flex justify-between">
      <h4>{variant.size}</h4>
      <p>{variant.priceDisplay}</p>
    </div>
  );
};
