"use client";

import { useMemo } from "react";
import type { Competitor } from "@/app/models/Catalog";
import { Badge } from "@/components/ui/badge";

interface Props {
  data: Competitor[];
}

export const CompetitorList = ({ data }: Props) => {
  const competitors = useMemo(() => {
    return data.map((competitor) => (
      <Badge key={competitor.key}>{competitor.name}</Badge>
    ));
  }, [data]);

  return <div className="flex gap-2 pt-4">{competitors}</div>;
};
