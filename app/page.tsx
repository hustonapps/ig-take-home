"use client";

import { useCatalog } from "@/app/Contexts/CatalogContext";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { CompetitorList } from "./components/CompetitorList";
import { CategoryList } from "./components/CategoryList";

export default function Home() {
  const { catalog } = useCatalog();

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <main className=" flex flex-col container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Mott & Bow Price Analysis Tool</CardTitle>
            <CardDescription>
              Compare Competitor Pricing on Products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <h2>Competitors</h2>
                <CompetitorList data={catalog?.competitorList ?? []} />
              </div>
              <div>
                <h2>Product Categories</h2>
                <CategoryList data={catalog?.productCategories ?? []} />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
