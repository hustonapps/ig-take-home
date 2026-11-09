import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";

export class ProductDisplay {
  key: string = "";
  vendor: string = "";
  id: string = "";
  variants: ProductVariant[] = [];
  name: string = "";
  fullData: Record<string, any> = {};
  imageUrl: string = "";

  constructor(vendor: string) {
    this.key = `${vendor}`;
    this.vendor = vendor;
  }
}

// Specific Mapper for True Classic
export class TrueClassicProductDisplay extends ProductDisplay {
  constructor(product: Product) {
    super("trueClassic");
    this.id = `${product.id}`;
    this.key = this.key + product.handle;
    this.name = product?.title;
    this.variants = (product?.variants ?? []).map(
      (variant: any) =>
        new ProductVariant(
          `${variant.id}`,
          variant?.title ?? "-",
          variant?.price ?? 0,
        ),
    );
    this.imageUrl = product?.images?.[0].src;
    this.fullData = product;
  }
}

// Specific Mapper for Me Undies
export class MeUndiesProductDisplay extends ProductDisplay {
  constructor(product: Product) {
    super("meUndies");
    this.id = `${product.id}`;
    this.key = this.key + product.handle;
    this.name = product?.title;
    this.variants = (product.variants.edges ?? []).map(
      ({ node: variant }: any) => {
        return new ProductVariant(
          `${variant.id}`,
          variant.title,
          parseFloat(variant.price.amount),
        );
      },
    );
    this.imageUrl = product.featuredImage.url;
    this.fullData = product;
  }
}

// Specific Mapper for Adidas
export class AdidasProductDisplay extends ProductDisplay {
  constructor(product: Product) {
    super("adidas");
    this.id = `${product.id}`;
    this.key = this.key + product.model_number;
    this.name = product.name;
    this.variants = (product.variation_list ?? []).map((variant: any) => {
      return new ProductVariant(
        variant.sku,
        variant.size,
        product.pricing_information.currentPrice,
      );
    });
    this.imageUrl = product.view_list?.[0].image_url;
    this.fullData = product;
  }
}
