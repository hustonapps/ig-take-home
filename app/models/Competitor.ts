import { Product } from "./Product";

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
