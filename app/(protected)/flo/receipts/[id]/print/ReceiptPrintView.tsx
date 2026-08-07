"use client";

import { useEffect } from "react";

type LineItem = { description: string; amount: string };

type Receipt = {
  id: string;
  receipt_number: string;
  client_name: string;
  client_email: string | null;
  items: LineItem[];
  total: number;
  status: string;
  notes: string | null;
  issued_date: string;
  due_date: string | null;
  paid_date: string | null;
};

function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReceiptPrintView({ receipt }: { receipt: Receipt }) {
  useEffect(() => {
    window.print();
  }, []);

  const statusColor =
    receipt.status === "paid"
      ? "#16a34a"
      : receipt.status === "sent"
      ? "#d97706"
      : "#71717a";

  return (
    <>
      <style>{`
        @media print {
          .screen-only { display: none !important; }
          body { background: white !important; }
        }
        body { background: white; }
      `}</style>

      {/* Screen-only toolbar */}
      <div
        className="screen-only"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 32px",
          background: "#f4f4f5",
          borderBottom: "1px solid #e4e4e7",
        }}
      >
        <button
          onClick={() => window.print()}
          style={{
            padding: "8px 16px",
            background: "#18181b",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Print / Save as PDF
        </button>
        <a
          href="/flo/receipts"
          style={{ fontSize: 13, color: "#71717a", textDecoration: "none" }}
        >
          ← Back to Receipts
        </a>
      </div>

      {/* Receipt */}
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "48px 40px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color: "#0a0a0a",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 40,
          }}
        >
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
              Common Ground Workshop
            </div>
            <div
              style={{ fontSize: 13, color: "#52525b", lineHeight: 1.7 }}
            >
              hello@cg-workshop.com
              <br />
              cg-workshop.com
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                display: "block",
                marginBottom: 6,
              }}
            >
              {receipt.receipt_number}
            </div>
            <div style={{ fontSize: 13, color: "#52525b", lineHeight: 1.7 }}>
              Issued: {fmtDate(receipt.issued_date)}
              {receipt.due_date && (
                <>
                  <br />
                  Due: {fmtDate(receipt.due_date)}
                </>
              )}
              {receipt.paid_date && (
                <>
                  <br />
                  Paid: {fmtDate(receipt.paid_date)}
                </>
              )}
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: 8,
                padding: "2px 10px",
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: ".12em",
                border: `1px solid ${statusColor}55`,
                color: statusColor,
                background: `${statusColor}10`,
              }}
            >
              {receipt.status}
            </div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "2px solid #0a0a0a", marginBottom: 32 }} />

        {/* Bill to */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase" as const,
              letterSpacing: ".15em",
              color: "#71717a",
              marginBottom: 6,
            }}
          >
            Bill To
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>
            {receipt.client_name}
          </div>
          {receipt.client_email && (
            <div style={{ fontSize: 13, color: "#52525b" }}>
              {receipt.client_email}
            </div>
          )}
        </div>

        {/* Line items */}
        <table style={{ width: "100%", borderCollapse: "collapse", margin: "0 0 24px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e4e4e7" }}>
              <th
                style={{
                  textAlign: "left",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: ".12em",
                  color: "#71717a",
                  paddingBottom: 8,
                }}
              >
                Description
              </th>
              <th
                style={{
                  textAlign: "right",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: ".12em",
                  color: "#71717a",
                  paddingBottom: 8,
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "10px 0", fontSize: 14, color: "#3f3f46" }}>
                  {item.description || "—"}
                </td>
                <td
                  style={{
                    padding: "10px 0",
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: "right",
                  }}
                >
                  {fmt$(parseFloat(item.amount) || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "baseline",
            gap: 48,
            marginTop: 16,
          }}
        >
          <span style={{ fontSize: 14, color: "#52525b" }}>Total</span>
          <span style={{ fontSize: 26, fontWeight: 900 }}>
            {fmt$(receipt.total)}
          </span>
        </div>

        {/* Notes */}
        {receipt.notes && (
          <div
            style={{
              marginTop: 40,
              padding: "16px 20px",
              background: "#fafafa",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: ".15em",
                color: "#71717a",
                marginBottom: 6,
              }}
            >
              Notes
            </div>
            <div style={{ fontSize: 13, color: "#52525b", lineHeight: 1.6 }}>
              {receipt.notes}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 56,
            paddingTop: 20,
            borderTop: "1px solid #e4e4e7",
            textAlign: "center",
            fontSize: 12,
            color: "#a1a1aa",
          }}
        >
          Thank you for your business.
        </div>
      </div>
    </>
  );
}
