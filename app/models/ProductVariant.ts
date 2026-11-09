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
