"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  data: string[] | undefined;
  value: string | null;
  setSelectedValue: (value: string | null) => void;
}

export const CategoryList = ({ data = [], value, setSelectedValue }: Props) => {
  return (
    <div>
      <Select value={value} onValueChange={setSelectedValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {data.map((category) => (
            <SelectItem key={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
