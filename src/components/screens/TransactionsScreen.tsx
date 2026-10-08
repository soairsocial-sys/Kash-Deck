import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Download,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { TransactionType, TransactionStatus } from '../../types';
import { LedgerGridVector, CurrencyWaveVector } from '../common/UiVectors';
import { AddIncomeModal } from '../common/AddIncomeModal';
import { AddExpenseModal } from '../common/AddExpenseModal';

export const TransactionsScreen: React.FC = () => {
  const {
    transactions,
    accounts,
    addTransaction,
    openDetail,
    searchQuery,
    setSearchQuery
  } = useFinancial();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Transaction Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [transferToAccountId, setTransferToAccountId] = useState(accounts[1]?.id || '');
  const [status, setStatus] = useState<TransactionStatus>('Completed');
  const [notes, setNotes] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.accountName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesAccount = accountFilter === 'all' || tx.accountId === accountFilter;

    return matchesSearch && matchesType && matchesStatus && matchesAccount;
  });

  const totalInflow = filteredTransactions
    .filter(t => t.type === 'income' || t.amount > 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  const totalOutflow = filteredTransactions
    .filter(t => t.type === 'expense' || t.amount < 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!description || isNaN(numAmount)) return;

    const selectedAcc = accounts.find(a => a.id === accountId);
    const signedAmount = txType === 'expense' ? -Math.abs(numAmount) : Math.abs(numAmount);

    addTransaction({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description,
      category: txType === 'transfer' ? 'Transfer' : category,
      amount: signedAmount,
      accountId,
      accountName: selectedAcc?.name || 'Account',
      type: txType,
      status,
      isBusiness,
      notes,
      transferToAccountId: txType === 'transfer' ? transferToAccountId : undefined
    });

    // Reset & close
    setDescription('');
    setAmount('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Description', 'Category', 'Account', 'Amount', 'Type', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      `"${t.accountName}"`,
      t.amount,
      t.type,
      t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cashdeck_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Transactions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Clean, searchable record of all financial flows and transfers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Aggregate Ledger Cards with UI Vectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="relative overflow-hidden bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="absolute right-0 bottom-0 w-28 h-full pointer-events-none opacity-15">
            <LedgerGridVector className="text-slate-400" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Filtered Inflows</span>
            <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">
              +
            </span>
          </div>
          <h3 className="relative z-10 text-lg sm:text-xl font-bold text-emerald-700 tracking-tight mt-1">
            ₦{totalInflow.toLocaleString()}
          </h3>
          <span className="relative z-10 text-[10px] text-slate-400 mt-0.5 block">
            Credits & income deposits
          </span>
        </div>

        <div className="relative overflow-hidden bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="absolute right-0 bottom-0 w-24 h-12 pointer-events-none opacity-15">
            <CurrencyWaveVector className="text-rose-500" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Filtered Outflows</span>
            <span className="w-5 h-5 rounded-md bg-rose-50 text-rose-700 flex items-center justify-center text-xs font-bold">
              -
            </span>
          </div>
          <h3 className="relative z-10 text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-1">
            ₦{totalOutflow.toLocaleString()}
          </h3>
          <span className="relative z-10 text-[10px] text-slate-400 mt-0.5 block">
            Debits, bills & purchases
          </span>
        </div>

        <div className="relative overflow-hidden bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Matching Records</span>
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
              Ledger
            </span>
          </div>
          <h3 className="relative z-10 text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-1">
            {filteredTransactions.length} <span className="text-xs font-normal text-slate-400">records</span>
          </h3>
          <span className="relative z-10 text-[10px] text-slate-400 mt-0.5 block">
            Across {accounts.length} linked accounts
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/70 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search description, category, or account..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200/80 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="income">Income (+)</option>
            <option value="expense">Expense (-)</option>
            <option value="transfer">Account Transfer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Needs review">Needs review</option>
            <option value="Reversed">Reversed</option>
          </select>

          {/* Account Filter */}
          <select
            value={accountFilter}
            onChange={e => setAccountFilter(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80 focus:outline-none"
          >
            <option value="all">All Accounts</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl border border-slate-200/70 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-semibold border-b border-slate-100 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3.5">Date</th>
                <th className="py-2.5 px-3.5">Description</th>
                <th className="py-2.5 px-3.5">Category</th>
                <th className="py-2.5 px-3.5">Account</th>
                <th className="py-2.5 px-3.5 text-right">Amount</th>
                <th className="py-2.5 px-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(tx => (
                <tr
                  key={tx.id}
                  onClick={() => openDetail('transaction', tx)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-2.5 px-3.5 text-slate-500 whitespace-nowrap">
                    {tx.date}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <p className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {tx.description}
                    </p>
                    {tx.merchantOrParty && (
                      <p className="text-[10px] text-slate-400">{tx.merchantOrParty}</p>
                    )}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-600 font-medium">
                    {tx.accountName}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-bold whitespace-nowrap">
                    <span className={tx.amount > 0 ? 'text-emerald-700' : 'text-slate-900'}>
                      {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        tx.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : tx.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Transaction</h3>
            <form onSubmit={handleCreateTransaction} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['expense', 'income', 'transfer'] as TransactionType[]).map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTxType(t)}
                      className={`py-2 rounded-xl font-bold capitalize border ${
                        txType === t
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shoprite Groceries, Bolt ride"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Amount (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-600"
                />
              </div>

              {txType !== 'transfer' ? (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Transport">Transport</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Personal">Personal</option>
                    <option value="Bills & Utilities">Bills & Utilities</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Business">Business</option>
                    <option value="Salary">Salary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Transfer Destination Account</label>
                  <select
                    value={transferToAccountId}
                    onChange={e => setTransferToAccountId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (₦{acc.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Account</label>
                <select
                  value={accountId}
                  onChange={e => setAccountId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (₦{acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#047857] hover:bg-emerald-800 text-white font-bold rounded-xl"
                >
                  Save Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modals */}
      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
      />
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />
    </div>
  );
};
