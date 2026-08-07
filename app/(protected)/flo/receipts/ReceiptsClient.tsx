"use client";

import { useState } from "react";
import Link from "next/link";
import { CGMedallion } from "@/app/components/ui/CGMark";

type LineItem = { description: string; amount: string };

type Receipt = {
  id: string;
  receipt_number: string;
  client_name: string;
  client_email: string | null;
  org_id: string | null;
  items: LineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: "draft" | "sent" | "paid";
  notes: string | null;
  issued_date: string;
  due_date: string | null;
  paid_date: string | null;
  created_at: string;
};

type Transaction = {
  id: string;
  type: "expense" | "income";
  description: string;
  amount: number;
  vendor: string | null;
  category: string;
  date: string;
  notes: string | null;
  created_at: string;
};

type Org = { id: string; name: string; slug: string };

interface ReceiptsClientProps {
  initialReceipts: Receipt[];
  initialTransactions: Transaction[];
  orgs: Org[];
}

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

const STATUS_STYLES: Record<string, string> = {
  draft: "text-zinc-500 bg-zinc-900 border-zinc-700",
  sent: "text-amber-400 bg-amber-950/30 border-amber-800/50",
  paid: "text-emerald-400 bg-emerald-950/30 border-emerald-800/50",
};

const CATEGORIES = [
  "hosting",
  "domain",
  "software",
  "subscriptions",
  "equipment",
  "services",
  "other",
];

const CATEGORY_COLORS: Record<string, string> = {
  hosting: "text-blue-400",
  domain: "text-purple-400",
  software: "text-cyan-400",
  subscriptions: "text-indigo-400",
  equipment: "text-orange-400",
  services: "text-pink-400",
  other: "text-zinc-400",
};


const today = new Date().toISOString().split("T")[0];

const EMPTY_RECEIPT = {
  client_name: "",
  client_email: "",
  org_id: "",
  issued_date: today,
  due_date: "",
  notes: "",
  items: [{ description: "", amount: "" }] as LineItem[],
};

const EMPTY_TXN: {
  type: "expense" | "income";
  date: string;
  description: string;
  amount: string;
  vendor: string;
  category: string;
  notes: string;
} = {
  type: "expense",
  date: today,
  description: "",
  amount: "",
  vendor: "",
  category: "other",
  notes: "",
};

export default function ReceiptsClient({
  initialReceipts,
  initialTransactions,
  orgs,
}: ReceiptsClientProps) {
  const [tab, setTab] = useState<"receipts" | "transactions">("receipts");
  const [receipts, setReceipts] = useState(initialReceipts);
  const [transactions, setTransactions] = useState(initialTransactions);

  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [receiptForm, setReceiptForm] = useState(EMPTY_RECEIPT);
  const [savingReceipt, setSavingReceipt] = useState(false);

  const [showTxnForm, setShowTxnForm] = useState(false);
  const [txnForm, setTxnForm] = useState(EMPTY_TXN);
  const [savingTxn, setSavingTxn] = useState(false);

  function addLineItem() {
    setReceiptForm((f) => ({
      ...f,
      items: [...f.items, { description: "", amount: "" }],
    }));
  }

  function removeLineItem(idx: number) {
    setReceiptForm((f) => ({
      ...f,
      items: f.items.filter((_, i) => i !== idx),
    }));
  }

  function updateLineItem(idx: number, field: keyof LineItem, value: string) {
    setReceiptForm((f) => ({
      ...f,
      items: f.items.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));
  }

  const receiptTotal = receiptForm.items.reduce(
    (s, item) => s + (parseFloat(item.amount) || 0),
    0
  );

  async function saveReceipt(status: "draft" | "sent") {
    if (!receiptForm.client_name.trim()) return;
    setSavingReceipt(true);
    try {
      const res = await fetch("/api/flo/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...receiptForm, status }),
      });
      if (!res.ok) throw new Error();
      const { receipt } = await res.json();
      setReceipts((prev) => [receipt, ...prev]);
      setReceiptForm(EMPTY_RECEIPT);
      setShowReceiptForm(false);
    } finally {
      setSavingReceipt(false);
    }
  }

  async function updateReceiptStatus(id: string, status: Receipt["status"]) {
    const res = await fetch(`/api/flo/receipts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setReceipts((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    }
  }

  async function deleteReceipt(id: string) {
    const res = await fetch(`/api/flo/receipts/${id}`, { method: "DELETE" });
    if (res.ok) setReceipts((prev) => prev.filter((r) => r.id !== id));
  }

  async function saveTransaction() {
    if (!txnForm.description.trim() || !txnForm.amount) return;
    setSavingTxn(true);
    try {
      const res = await fetch("/api/flo/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txnForm),
      });
      if (!res.ok) throw new Error();
      const { transaction } = await res.json();
      setTransactions((prev) => [transaction, ...prev]);
      setTxnForm({ ...EMPTY_TXN, date: new Date().toISOString().split("T")[0] });
      setShowTxnForm(false);
    } finally {
      setSavingTxn(false);
    }
  }

  async function deleteTransaction(id: string) {
    const res = await fetch(`/api/flo/transactions/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const net = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <CGMedallion size={26} color="#f59e0b" />
          <div className="w-px h-5 bg-zinc-700" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
            FLO
          </span>
          <div className="w-px h-5 bg-zinc-700" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Receipts
          </span>
        </div>
        <Link
          href="/flo"
          className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to FLO
        </Link>
      </header>

      {/* Tabs */}
      <div className="border-b border-zinc-800/60 px-6">
        <div className="flex gap-1 -mb-px">
          {(["receipts", "transactions"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] border-b-2 transition-colors ${
                tab === t
                  ? "border-amber-500 text-amber-400"
                  : "border-transparent text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {t === "receipts" ? "Receipts" : "Transactions"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          {/* ── RECEIPTS ── */}
          {tab === "receipts" && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-200">
                  {receipts.length}{" "}
                  {receipts.length === 1 ? "receipt" : "receipts"}
                </p>
                <button
                  onClick={() => setShowReceiptForm((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-semibold transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  New Receipt
                </button>
              </div>

              {showReceiptForm && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-500">
                    New Receipt
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[11px] text-zinc-500 mb-1.5">
                        Client Name *
                      </label>
                      <input
                        value={receiptForm.client_name}
                        onChange={(e) =>
                          setReceiptForm((f) => ({
                            ...f,
                            client_name: e.target.value,
                          }))
                        }
                        placeholder="Jane Smith"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[11px] text-zinc-500 mb-1.5">
                        Client Email
                      </label>
                      <input
                        value={receiptForm.client_email}
                        onChange={(e) =>
                          setReceiptForm((f) => ({
                            ...f,
                            client_email: e.target.value,
                          }))
                        }
                        placeholder="jane@example.com"
                        type="email"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-1.5">
                        Issued Date
                      </label>
                      <input
                        type="date"
                        value={receiptForm.issued_date}
                        onChange={(e) =>
                          setReceiptForm((f) => ({
                            ...f,
                            issued_date: e.target.value,
                          }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-1.5">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={receiptForm.due_date}
                        onChange={(e) =>
                          setReceiptForm((f) => ({
                            ...f,
                            due_date: e.target.value,
                          }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    {orgs.length > 0 && (
                      <div className="col-span-2">
                        <label className="block text-[11px] text-zinc-500 mb-1.5">
                          Link to Organization (optional)
                        </label>
                        <select
                          value={receiptForm.org_id}
                          onChange={(e) =>
                            setReceiptForm((f) => ({
                              ...f,
                              org_id: e.target.value,
                            }))
                          }
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors"
                        >
                          <option value="">— Not linked —</option>
                          {orgs.map((org) => (
                            <option key={org.id} value={org.id}>
                              {org.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Line items */}
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-2">
                      Line Items *
                    </label>
                    <div className="space-y-2">
                      {receiptForm.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            value={item.description}
                            onChange={(e) =>
                              updateLineItem(idx, "description", e.target.value)
                            }
                            placeholder="Description"
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                          />
                          <input
                            value={item.amount}
                            onChange={(e) =>
                              updateLineItem(idx, "amount", e.target.value)
                            }
                            placeholder="0.00"
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-28 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors text-right"
                          />
                          {receiptForm.items.length > 1 && (
                            <button
                              onClick={() => removeLineItem(idx)}
                              className="text-zinc-700 hover:text-red-400 transition-colors p-1 shrink-0"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addLineItem}
                      className="mt-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      Add item
                    </button>
                    <div className="flex justify-end mt-3 pt-3 border-t border-zinc-800">
                      <span className="text-xs text-zinc-400">
                        Total:{" "}
                        <strong className="text-zinc-100 text-sm">
                          {fmt$(receiptTotal)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1.5">
                      Notes
                    </label>
                    <textarea
                      value={receiptForm.notes}
                      onChange={(e) =>
                        setReceiptForm((f) => ({ ...f, notes: e.target.value }))
                      }
                      placeholder="Payment terms, thank you note, etc."
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      onClick={() => saveReceipt("draft")}
                      disabled={savingReceipt || !receiptForm.client_name.trim()}
                      className="px-4 py-2 rounded-lg border border-zinc-700 text-xs font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 disabled:opacity-40 transition-colors"
                    >
                      {savingReceipt ? "Saving…" : "Save as Draft"}
                    </button>
                    <button
                      onClick={() => saveReceipt("sent")}
                      disabled={savingReceipt || !receiptForm.client_name.trim()}
                      className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-zinc-950 disabled:opacity-40 transition-colors"
                    >
                      {savingReceipt ? "Saving…" : "Mark as Sent"}
                    </button>
                    <button
                      onClick={() => {
                        setShowReceiptForm(false);
                        setReceiptForm(EMPTY_RECEIPT);
                      }}
                      className="ml-auto px-4 py-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {receipts.length === 0 && !showReceiptForm ? (
                <div className="text-center py-16 text-zinc-700">
                  <p className="text-sm">No receipts yet. Create your first one above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {receipts.map((r) => (
                    <ReceiptCard
                      key={r.id}
                      receipt={r}
                      onStatusChange={updateReceiptStatus}
                      onDelete={deleteReceipt}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── TRANSACTIONS ── */}
          {tab === "transactions" && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-4">
                  <p className="text-[11px] text-zinc-600 mb-1">Income</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {fmt$(totalIncome)}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-4">
                  <p className="text-[11px] text-zinc-600 mb-1">Expenses</p>
                  <p className="text-xl font-bold text-red-400">
                    {fmt$(totalExpenses)}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-4">
                  <p className="text-[11px] text-zinc-600 mb-1">Net</p>
                  <p
                    className={`text-xl font-bold ${
                      net >= 0 ? "text-zinc-100" : "text-red-400"
                    }`}
                  >
                    {fmt$(net)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-200">
                  {transactions.length}{" "}
                  {transactions.length === 1 ? "transaction" : "transactions"}
                </p>
                <button
                  onClick={() => setShowTxnForm((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-semibold transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Log Transaction
                </button>
              </div>

              {showTxnForm && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-500">
                    Log Transaction
                  </p>

                  <div className="flex gap-2">
                    {(["expense", "income"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTxnForm((f) => ({ ...f, type: t }))}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                          txnForm.type === t
                            ? t === "expense"
                              ? "border-red-700/60 bg-red-950/30 text-red-400"
                              : "border-emerald-700/60 bg-emerald-950/30 text-emerald-400"
                            : "border-zinc-700 text-zinc-600 hover:text-zinc-400"
                        }`}
                      >
                        {t === "expense" ? "Expense" : "Income"}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-1.5">
                        Date
                      </label>
                      <input
                        type="date"
                        value={txnForm.date}
                        onChange={(e) =>
                          setTxnForm((f) => ({ ...f, date: e.target.value }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-1.5">
                        Amount *
                      </label>
                      <input
                        type="number"
                        value={txnForm.amount}
                        onChange={(e) =>
                          setTxnForm((f) => ({ ...f, amount: e.target.value }))
                        }
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] text-zinc-500 mb-1.5">
                        Description *
                      </label>
                      <input
                        value={txnForm.description}
                        onChange={(e) =>
                          setTxnForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Domain renewal for elevated-beauty.com"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-1.5">
                        Vendor / Source
                      </label>
                      <input
                        value={txnForm.vendor}
                        onChange={(e) =>
                          setTxnForm((f) => ({ ...f, vendor: e.target.value }))
                        }
                        placeholder="Namecheap"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-1.5">
                        Category
                      </label>
                      <select
                        value={txnForm.category}
                        onChange={(e) =>
                          setTxnForm((f) => ({
                            ...f,
                            category: e.target.value,
                          }))
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500 transition-colors"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] text-zinc-500 mb-1.5">
                        Notes
                      </label>
                      <input
                        value={txnForm.notes}
                        onChange={(e) =>
                          setTxnForm((f) => ({ ...f, notes: e.target.value }))
                        }
                        placeholder="Optional"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={saveTransaction}
                      disabled={
                        savingTxn ||
                        !txnForm.description.trim() ||
                        !txnForm.amount
                      }
                      className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-zinc-950 disabled:opacity-40 transition-colors"
                    >
                      {savingTxn ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setShowTxnForm(false);
                        setTxnForm(EMPTY_TXN);
                      }}
                      className="px-4 py-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {transactions.length === 0 && !showTxnForm ? (
                <div className="text-center py-16 text-zinc-700">
                  <p className="text-sm">No transactions yet. Log your first one above.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((t) => (
                    <TransactionRow
                      key={t.id}
                      transaction={t}
                      onDelete={deleteTransaction}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ReceiptCard({
  receipt,
  onStatusChange,
  onDelete,
}: {
  receipt: Receipt;
  onStatusChange: (id: string, status: Receipt["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3.5 flex items-center gap-4 text-left hover:bg-zinc-800/30 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-mono text-zinc-600">
              {receipt.receipt_number}
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_STYLES[receipt.status]}`}
            >
              {receipt.status}
            </span>
          </div>
          <p className="text-sm font-medium text-zinc-200 truncate">
            {receipt.client_name}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-zinc-100">{fmt$(receipt.total)}</p>
          <p className="text-[11px] text-zinc-600">{fmtDate(receipt.issued_date)}</p>
        </div>
        <svg
          className={`w-4 h-4 text-zinc-700 shrink-0 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 px-4 pb-4 pt-3 space-y-3">
          <div className="space-y-1.5">
            {receipt.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-zinc-400">{item.description || "—"}</span>
                <span className="text-zinc-300 font-medium">
                  {fmt$(parseFloat(item.amount) || 0)}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-xs pt-2 border-t border-zinc-800">
              <span className="text-zinc-500 font-medium">Total</span>
              <span className="text-zinc-100 font-bold">{fmt$(receipt.total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
            {receipt.client_email && (
              <div>
                <span className="text-zinc-600">Email: </span>
                <span className="text-zinc-400">{receipt.client_email}</span>
              </div>
            )}
            {receipt.due_date && (
              <div>
                <span className="text-zinc-600">Due: </span>
                <span className="text-zinc-400">{fmtDate(receipt.due_date)}</span>
              </div>
            )}
            {receipt.paid_date && (
              <div>
                <span className="text-zinc-600">Paid: </span>
                <span className="text-emerald-400">
                  {fmtDate(receipt.paid_date)}
                </span>
              </div>
            )}
          </div>

          {receipt.notes && (
            <p className="text-xs text-zinc-500 italic">{receipt.notes}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {receipt.status === "draft" && (
              <button
                onClick={() => onStatusChange(receipt.id, "sent")}
                className="text-[11px] px-3 py-1.5 rounded-lg border border-amber-800/50 text-amber-400 hover:bg-amber-950/30 transition-colors"
              >
                Mark Sent
              </button>
            )}
            {receipt.status === "sent" && (
              <button
                onClick={() => onStatusChange(receipt.id, "paid")}
                className="text-[11px] px-3 py-1.5 rounded-lg border border-emerald-800/50 text-emerald-400 hover:bg-emerald-950/30 transition-colors"
              >
                Mark Paid
              </button>
            )}
            {receipt.status === "paid" && (
              <button
                onClick={() => onStatusChange(receipt.id, "sent")}
                className="text-[11px] px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Undo Paid
              </button>
            )}
            <a
              href={`/flo/receipts/${receipt.id}/print`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
                />
              </svg>
              Print / PDF
            </a>
            <button
              onClick={() => {
                if (!confirming) {
                  setConfirming(true);
                  return;
                }
                onDelete(receipt.id);
              }}
              onBlur={() => setConfirming(false)}
              className={`ml-auto text-[11px] transition-colors ${
                confirming
                  ? "text-red-400"
                  : "text-zinc-700 hover:text-red-400"
              }`}
            >
              {confirming ? "Confirm delete?" : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionRow({
  transaction: t,
  onDelete,
}: {
  transaction: Transaction;
  onDelete: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/30 transition-colors group">
      <div
        className={`text-xs font-bold uppercase tracking-wider w-8 shrink-0 ${
          t.type === "income" ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {t.type === "income" ? "IN" : "OUT"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-zinc-200 truncate">{t.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {t.vendor && (
            <span className="text-[11px] text-zinc-600">{t.vendor}</span>
          )}
          <span
            className={`text-[11px] capitalize ${
              CATEGORY_COLORS[t.category] ?? "text-zinc-500"
            }`}
          >
            {t.category}
          </span>
          {t.notes && (
            <span className="text-[11px] text-zinc-700 italic truncate">
              {t.notes}
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={`text-sm font-bold ${
            t.type === "income" ? "text-emerald-400" : "text-zinc-100"
          }`}
        >
          {t.type === "expense" ? "−" : "+"}
          {fmt$(t.amount)}
        </p>
        <p className="text-[11px] text-zinc-600">{fmtDate(t.date)}</p>
      </div>
      <button
        onClick={() => {
          if (!confirming) {
            setConfirming(true);
            return;
          }
          onDelete(t.id);
        }}
        onBlur={() => setConfirming(false)}
        className={`shrink-0 text-[11px] transition-colors opacity-0 group-hover:opacity-100 ${
          confirming
            ? "text-red-400 opacity-100"
            : "text-zinc-700 hover:text-red-400"
        }`}
      >
        {confirming ? "Confirm?" : "×"}
      </button>
    </div>
  );
}
