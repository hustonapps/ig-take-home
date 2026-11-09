import type { ProductVariant } from "@/app/models/ProductVariant";

interface Props {
  variant: ProductVariant;
}

export const ProductLineItem = ({ variant }: Props) => {
  return (
    <div className="flex justify-between border-b border-accent pb-2">
      <h4>
        {variant.size}{" "}
        <small className="text-xs text-muted-foreground">
          (id: {variant.id})
        </small>
      </h4>
      <p>{variant.priceDisplay}</p>
    </div>
  );
};
