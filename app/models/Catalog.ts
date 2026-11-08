export class Product {
  category: string = "";
  [key: string]: any;

  constructor(data: any) {
    const { category, ...rest } = data;
    this.category = category;
    Object.assign(this, rest);
  }
}

export class ProductVariant {
  id: string = "";
  size: string = "";
  price: number = 0;

  constructor(id: string, size: string, price: number) {
    this.id = id;
    this.size = size;
    this.price = price;
  }

  get priceDisplay(): string {
    if (typeof this.price === "string") {
      return `$${parseFloat(this.price).toFixed(2)}`;
    }
    return `$${this.price.toFixed(2)}`;
  }
}

export class ProductDisplay {
  key: string = "";
  vendor: string = "";
  id: string = "";
  variants: ProductVariant[] = [];
  name: string = "";
  fullData: Record<string, any> = {};

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
    this.fullData = product;
  }
}

export class Competitor {
  key: string = "";
  name: string = "";
  products: Product[] = [];

  constructor(data: any) {
    this.key = data.key;
    this.name = data.name;
    this.products = data.products.map((product: any) => new Product(product));
  }

  get productCategoriesForCompetitor(): string[] {
    return [
      ...new Set(
        this.products.reduce((acc: string[], product: Product) => {
          return [...acc, product.category ?? "unknown"];
        }, []),
      ),
    ];
  }
}

export class Catalog {
  competitors: Competitor[] = [];

  constructor(data: any) {
    this.competitors = data.competitors.map(
      (competitor: any) => new Competitor(competitor),
    );
  }

  get competitorList(): Competitor[] {
    return this.competitors;
  }

  get productCategories(): string[] {
    return this.competitors.reduce((acc: string[], competitor: Competitor) => {
      const categories = competitor.productCategoriesForCompetitor;
      if (acc.some((category) => categories.includes(category))) {
        return acc;
      }
      return [...acc, ...categories];
    }, []);
  }

  getProductsByCategory(category: string): Product[] {
    return this.competitors.reduce((acc: Product[], competitor: Competitor) => {
      const products = competitor.products.filter(
        (product: Product) => product.category === category,
      );
      return [...acc, ...products];
    }, []);
  }
}
