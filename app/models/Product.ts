export class Product {
  category: string = "";
  [key: string]: any;

  constructor(data: any) {
    const { category, ...rest } = data;
    this.category = category;
    Object.assign(this, rest);
  }
}
