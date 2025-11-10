import React from "react";
import { Button } from "@/components/ui/button";

export default function BookingFilters({
  query,
  setQuery,
  filterStatus,
  setFilterStatus,
  onClear,
  onRefresh,
  onNew,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mb-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search by client, id, or service"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-xs md:text-sm w-full"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-xs md:text-sm"
        >
          <option value="all">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onClear}
          className="text-xs"
        >
          Clear
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRefresh}
          className="text-xs"
        >
          Refresh
        </Button>
        <Button size="sm" onClick={onNew} className="text-xs">
          New booking
        </Button>
      </div>
    </div>
  );
}
