import React from "react";
import { Button } from "@/components/ui/button";

export default function BookingTable({
  bookings,
  services,
  onConfirm,
  onView,
}) {
  return (
    <div className="overflow-x-auto bg-card border border-border rounded-lg">
      <table className="w-full text-xs md:text-sm">
        <thead>
          <tr className="text-muted-foreground text-left border-b border-border">
            <th className="px-3 py-3">ID</th>
            <th className="px-3 py-3">Client</th>
            <th className="px-3 py-3">Service</th>
            <th className="px-3 py-3">Date</th>
            <th className="px-3 py-3">Time</th>
            <th className="px-3 py-3">Amount</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const service = services.find((s) => s.id === b.serviceId);
            return (
              <tr
                key={b.id}
                className="border-t border-border hover:bg-accent/50"
              >
                <td className="px-3 py-3">{b.id}</td>
                <td className="px-3 py-3">{b.clientName}</td>
                <td className="px-3 py-3">{service?.name || "-"}</td>
                <td className="px-3 py-3">{b.date}</td>
                <td className="px-3 py-3">{b.time || b.startTime}</td>
                <td className="px-3 py-3">₦{b.amount || 0}</td>
                <td className="px-3 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${b.status === "confirmed" ? "bg-green-100 text-green-800 border border-green-300" : b.status === "pending" ? "bg-yellow-100 text-yellow-800 border border-yellow-300" : "bg-red-100 text-red-800 border border-red-300"}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onConfirm(b)}
                      className="text-xs"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(b)}
                      className="text-xs"
                    >
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
