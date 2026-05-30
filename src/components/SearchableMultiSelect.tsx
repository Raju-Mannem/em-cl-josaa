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
  const GROUP_MAP: Record<string, string> = {
    A: "bg-red-100",
    B: "bg-indigo-200",
    C: "bg-green-200",
    D: "bg-yellow-200",
  };

  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const hasClOptions = useMemo(() => options.some((o) => !!o.cl), [options]);

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

  const handleRangeSelect = (groupLabel: string, checked: boolean) => {
    const targetCl = GROUP_MAP[groupLabel];

    const groupValues = options
      .filter((o) => o.cl === targetCl)
      .map((o) => o.value);

    setSelectedValues((prev) => {
      if (checked) {
        return [...new Set([...prev, ...groupValues])];
      } else {
        return prev.filter((v) => !groupValues.includes(v));
      }
    });
  };

  const isGroupSelected = (groupLabel: string) => {
    const targetCl = GROUP_MAP[groupLabel];
    const group = options.filter((o) => o.cl === targetCl);
    if (group.length === 0) return false;
    return group.every((o) => selectedValues.includes(o.value));
  };

  return (
    <div className="flex flex-col justify-center">
      <span>{title}</span>
      <Dialog>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="justify-between max-h-[20px] sm:max-h-full max-w-[300px] sm:min-w-[200px] rounded"
            />
          }
          className={`bg-indigo-50 text-sm font-thin`}
        >
          <>
            <span className="text-[4px] sm:text-xs text-gray-400 font-normal">
              {selectedValues.length} selected
            </span>
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

          {hasClOptions && (
            <div className="flex gap-4 p-3 bg-slate-50 rounded-md border border-slate-200 mt-2">
              {Object.keys(GROUP_MAP).map((group) => (
                <label
                  key={group}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={isGroupSelected(group)}
                    onCheckedChange={(checked) =>
                      handleRangeSelect(group, !!checked)
                    }
                  />
                  <span
                    className={`text-sm font-bold p-1 rounded ${GROUP_MAP[group]}`}
                  >
                    {group}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4">
            <label className="flex items-center gap-3 py-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={() => handleSelectAll()}
              />

              <span className="font-medium">Select All</span>
            </label>
          </div>

          <div className="max-h-[300px] overflow-y-auto border border-indigo-100 rounded p-2">
            {filteredOptions.map((option) => (
              <label
                key={String(option.value)}
                className={`flex items-center gap-3 py-2 px-2 ${option.cl ? option.cl : "bg-gray-100"} hover:bg-stone-50 border-b border-gray-300`}
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
