"use client";

import { useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

type Option<T = string | number> = {
  label: string;
  value: T;
  cl?: string;
};

interface Props<T extends string | number> {
  title: string;
  options: Option<T>[];
  selectedValues: T[];
  setSelectedValues: React.Dispatch<React.SetStateAction<T[]>>;
}

export default function SearchableMultiSelect<T extends string | number>({
  title,
  options,
  selectedValues,
  setSelectedValues,
}: Props<T>) {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const isAllSelected =
    options.length > 0 && selectedValues.length === options.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedValues([]);
      return;
    }

    setSelectedValues(options.map((o) => o.value));
  };

  const toggleOption = (value: T, checked: boolean) => {
    setSelectedValues((prev) =>
      checked
        ? [...new Set([...prev, value])]
        : prev.filter((v) => v !== value),
    );
  };

  return (
    <div className="flex flex-col justify-center">
      <span>{title}</span>
      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="justify-between min-w-[220px] rounded"
            />
          }
          className={`bg-indigo-50 text-sm font-thin`}
        >
          <>
            <span className="text-xs text-gray-400 font-normal">{selectedValues.length} selected</span>
          </>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <Input
            placeholder={`Search ${title}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="mt-4">
            <label className="flex items-center gap-3 py-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={() => handleSelectAll()}
              />

              <span className="font-medium">Select All</span>
            </label>
          </div>

          <div className="max-h-[450px] overflow-y-auto border border-indigo-100 rounded p-2">
            {filteredOptions.map((option ) => (
              <label
                key={String(option.value)}
                className={`flex items-center gap-3 py-2 px-2 ${option.cl && option.cl} hover:bg-stone-50 border-b border-gray-300`}
              >
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) =>
                    toggleOption(option.value, Boolean(checked))
                  }
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            {selectedValues.length} selected
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
