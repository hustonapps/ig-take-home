class Product {
  category: string = "";
  [key: string]: unknown;

  constructor(data: any) {
    const { category, ...rest } = data;
    this.category = category;
    Object.assign(this, rest);
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
}
