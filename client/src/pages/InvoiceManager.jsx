import React, { useState } from "react";

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState([
    { id: 1, client: "Acme Corp", amount: 500, status: "Paid" },
    { id: 2, client: "EventCo", amount: 1200, status: "Pending" },
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Invoice Manager</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Invoice #</th>
            <th className="border border-gray-300 p-2">Client</th>
            <th className="border border-gray-300 p-2">Amount</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td className="border border-gray-300 p-2">{inv.id}</td>
              <td className="border border-gray-300 p-2">{inv.client}</td>
              <td className="border border-gray-300 p-2">${inv.amount}</td>
              <td className="border border-gray-300 p-2">{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
