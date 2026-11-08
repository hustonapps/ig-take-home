"use client";

import { Badge } from "@/components/ui/badge";

interface Props {
  data: string[];
}

export const CategoryList = ({ data }: Props) => {
  return (
    <div>
      {data.map((category) => (
        <Badge key={category}>{category}</Badge>
      ))}
    </div>
  );
};
