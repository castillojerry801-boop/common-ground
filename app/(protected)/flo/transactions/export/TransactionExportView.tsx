"use client";

import { useEffect } from "react";

type Transaction = {
  id: string;
  type: "expense" | "income";
  description: string;
  amount: number;
  vendor: string | null;
  category: string;
  date: string;
  notes: string | null;
};

function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TransactionExportView({
  transactions,
  from,
  to,
}: {
  transactions: Transaction[];
  from: string;
  to: string;
}) {
  useEffect(() => {
    window.print();
  }, []);

  const income = transactions.filter((t) => t.type === "income");
  const expenses = transactions.filter((t) => t.type === "expense");
  const totalIncome = income.reduce((s, t) => s + t.amount, 0);
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
  const net = totalIncome - totalExpenses;

  const fromLabel = from
    ? new Date(from + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const toLabel = to
    ? new Date(to + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const periodLabel =
    fromLabel && toLabel
      ? `${fromLabel} – ${toLabel}`
      : fromLabel
      ? `From ${fromLabel}`
      : toLabel
      ? `Through ${toLabel}`
      : "All Time";

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
          href="/flo/receipts?tab=transactions"
          style={{ fontSize: 13, color: "#71717a", textDecoration: "none" }}
        >
          ← Back to Transactions
        </a>
      </div>

      {/* Report */}
      <div
        style={{
          maxWidth: 720,
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
            marginBottom: 8,
          }}
        >
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
              Common Ground Workshop
            </div>
            <div style={{ fontSize: 13, color: "#52525b" }}>
              Transaction Report
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 13, color: "#52525b" }}>
            Generated{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            marginBottom: 4,
            marginTop: 24,
          }}
        >
          {periodLabel}
        </div>
        <div style={{ fontSize: 13, color: "#71717a", marginBottom: 32 }}>
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
        </div>

        <hr style={{ border: "none", borderTop: "2px solid #0a0a0a", marginBottom: 32 }} />

        {/* Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            { label: "Income", value: totalIncome, color: "#16a34a" },
            { label: "Expenses", value: totalExpenses, color: "#dc2626" },
            {
              label: "Net",
              value: net,
              color: net >= 0 ? "#0a0a0a" : "#dc2626",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: "16px 20px",
                background: "#fafafa",
                borderRadius: 8,
                border: "1px solid #e4e4e7",
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
                {s.label}
              </div>
              <div
                style={{ fontSize: 20, fontWeight: 800, color: s.color }}
              >
                {fmt$(s.value)}
              </div>
            </div>
          ))}
        </div>

        {/* Transaction list */}
        {sorted.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "32px 0", color: "#71717a", fontSize: 14 }}
          >
            No transactions in this period.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e4e4e7" }}>
                {["Date", "Description", "Category", "Vendor", "Amount"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: h === "Amount" ? "right" : "left",
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase" as const,
                        letterSpacing: ".12em",
                        color: "#71717a",
                        paddingBottom: 8,
                        paddingRight: h !== "Amount" ? 12 : 0,
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr
                  key={t.id}
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <td
                    style={{
                      padding: "8px 12px 8px 0",
                      fontSize: 12,
                      color: "#71717a",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {fmtDate(t.date)}
                  </td>
                  <td
                    style={{
                      padding: "8px 12px 8px 0",
                      fontSize: 13,
                      color: "#3f3f46",
                    }}
                  >
                    {t.description}
                    {t.notes && (
                      <div style={{ fontSize: 11, color: "#a1a1aa", marginTop: 1 }}>
                        {t.notes}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "8px 12px 8px 0",
                      fontSize: 12,
                      color: "#71717a",
                      textTransform: "capitalize" as const,
                    }}
                  >
                    {t.category}
                  </td>
                  <td
                    style={{
                      padding: "8px 12px 8px 0",
                      fontSize: 12,
                      color: "#71717a",
                    }}
                  >
                    {t.vendor || "—"}
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      fontSize: 13,
                      fontWeight: 600,
                      textAlign: "right",
                      color: t.type === "income" ? "#16a34a" : "#0a0a0a",
                    }}
                  >
                    {t.type === "expense" ? "−" : "+"}
                    {fmt$(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid #0a0a0a" }}>
                <td
                  colSpan={4}
                  style={{
                    paddingTop: 10,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Net
                </td>
                <td
                  style={{
                    paddingTop: 10,
                    fontSize: 16,
                    fontWeight: 900,
                    textAlign: "right",
                    color: net >= 0 ? "#0a0a0a" : "#dc2626",
                  }}
                >
                  {net >= 0 ? "+" : "−"}
                  {fmt$(Math.abs(net))}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </>
  );
}
