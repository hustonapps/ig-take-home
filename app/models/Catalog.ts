import { Competitor } from "./Competitor";
import { Product } from "./Product";

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
