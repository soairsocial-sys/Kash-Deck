import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Plus,
  Minus,
  ChevronRight,
  PieChart,
  BarChart2,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Building,
  CreditCard,
  Layers,
  ShoppingBag,
  Wifi,
  Briefcase
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { AddIncomeModal } from '../common/AddIncomeModal';
import { AddExpenseModal } from '../common/AddExpenseModal';
import { AddAccountModal } from '../common/AddAccountModal';
import { CreateGoalModal } from '../common/CreateGoalModal';

export const MoneyScreen: React.FC = () => {
  const { accounts, transactions } = useFinancial();

  // State
  const [activeTab, setActiveTab] = useState<'accounts' | 'transactions' | 'cashflow'>('accounts');
  const [chartViewMode, setChartViewMode] = useState<'donut' | 'bars'>('donut');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 4 Default Accounts matching Mockup
  const mockupAccounts = [
    {
      id: 'acc-1',
      name: 'GTBank',
      typeLabel: 'Bank Account',
      balance: 580000,
      logoColor: 'bg-[#ea580c]',
      logoText: 'GTB'
    },
    {
      id: 'acc-2',
      name: 'Access Bank',
      typeLabel: 'Bank Account',
      balance: 420000,
      logoColor: 'bg-[#0284c7]',
      logoText: 'ACC'
    },
    {
      id: 'acc-3',
      name: 'Cash',
      typeLabel: 'Cash Wallet',
      balance: 120000,
      logoColor: 'bg-[#059669]',
      logoText: '₦'
    },
    {
      id: 'acc-4',
      name: 'Wallet',
      typeLabel: 'Mobile Wallet',
      balance: 125000,
      logoColor: 'bg-[#7c3aed]',
      logoText: 'W'
    }
  ];

  // Balance breakdown by type
  const accountTypeBreakdown = [
    { label: 'Bank Accounts', percentage: 72, color: '#0284c7' },
    { label: 'Cash', percentage: 10, color: '#0d9488' },
    { label: 'Wallet', percentage: 10, color: '#f97316' },
    { label: 'Other', percentage: 8, color: '#1e293b' }
  ];

  // Donut geometry
  const radius = 54;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  // Recent Transactions matching Mockup
  const mockupTransactions = [
    {
      id: 'tx-1',
      title: 'Salary',
      sub: 'Income',
      date: 'Apr 28, 2025',
      amount: '+₦450,000',
      isIncome: true,
      icon: Briefcase,
      iconColor: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 'tx-2',
      title: 'Groceries',
      sub: 'Expense',
      date: 'Apr 27, 2025',
      amount: '-₦25,000',
      isIncome: false,
      icon: ShoppingBag,
      iconColor: 'bg-rose-50 text-rose-500'
    },
    {
      id: 'tx-3',
      title: 'Internet Subscription',
      sub: 'Expense',
      date: 'Apr 26, 2025',
      amount: '-₦12,000',
      isIncome: false,
      icon: Wifi,
      iconColor: 'bg-purple-50 text-purple-600'
    },
    {
      id: 'tx-4',
      title: 'Freelance',
      sub: 'Income',
      date: 'Apr 24, 2025',
      amount: '+₦80,000',
      isIncome: true,
      icon: Briefcase,
      iconColor: 'bg-teal-50 text-teal-600'
    }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Money</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your accounts, track your cash flow and get a complete view of your finances.
          </p>
        </div>

        {/* Subtabs: Accounts, Transactions, Cash Flow */}
        <div className="flex items-center gap-6 border-b border-transparent">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`text-xs font-semibold pb-1.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'accounts'
                ? 'text-emerald-800 font-bold border-emerald-600'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            Accounts
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`text-xs font-semibold pb-1.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'transactions'
                ? 'text-emerald-800 font-bold border-emerald-600'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`text-xs font-semibold pb-1.5 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'cashflow'
                ? 'text-emerald-800 font-bold border-emerald-600'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            Cash Flow
          </button>
        </div>
      </div>

      {/* 2. STAT SUMMARY CARDS (4 ACROSS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Balance Across Accounts */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <Wallet className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-medium text-slate-500">
                Total Balance Across Accounts
              </span>
              <div className="mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block">
                  ₦1,245,000
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  <span>↑ 8%</span>
                  <span className="text-slate-400 font-normal">vs. last month</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Total Income */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-medium text-slate-500">Total Income</span>
              <div className="mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block">
                  ₦650,000
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  <span>↑ 15%</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 font-bold text-lg">
              −
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-medium text-slate-500">Total Expenses</span>
              <div className="mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block">
                  ₦320,000
                </span>
                <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-0.5 mt-0.5">
                  <span>↑ 6%</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Net Cash Flow */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-medium text-slate-500">Net Cash Flow</span>
              <div className="mt-0.5">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 block">
                  ₦330,000
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  <span>↑ 22%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN THREE-COLUMN SECTION */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* COLUMN 1 (Left): Your Accounts */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-900">Your Accounts</h3>
                <button
                  onClick={() => setIsAddAccountOpen(true)}
                  className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-2 py-1 rounded-lg border border-emerald-100 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                  <span>Add Account</span>
                </button>
              </div>

              {/* Accounts list */}
              <div className="space-y-2.5">
                {mockupAccounts.map(acc => (
                  <div
                    key={acc.id}
                    onClick={() => showToast(`Selected ${acc.name} - ₦${acc.balance.toLocaleString()}`)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl ${acc.logoColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        {acc.logoText}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-950">
                          {acc.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {acc.typeLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">
                        ₦{acc.balance.toLocaleString()}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2 (Middle): Balance by Account Type & Recent Transactions */}
          <div className="lg:col-span-4 space-y-5">
            {/* Balance by Account Type Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900">Balance by Account Type</h3>
                <div className="flex items-center gap-1 text-slate-400">
                  <button
                    onClick={() => setChartViewMode('donut')}
                    className={`p-1 rounded hover:bg-slate-100 transition-colors ${chartViewMode === 'donut' ? 'text-emerald-700' : ''}`}
                  >
                    <PieChart className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setChartViewMode('bars')}
                    className={`p-1 rounded hover:bg-slate-100 transition-colors ${chartViewMode === 'bars' ? 'text-emerald-700' : ''}`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Donut and Legend */}
              <div className="flex items-center justify-between gap-4 py-1">
                {/* SVG Donut */}
                <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth={strokeWidth}
                    />
                    {accountTypeBreakdown.map((item, idx) => {
                      const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                      accumulatedPercent += item.percentage;
                      return (
                        <circle
                          key={idx}
                          cx="70"
                          cy="70"
                          r={radius}
                          fill="transparent"
                          stroke={item.color}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-300"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[11px] font-extrabold text-slate-900 leading-tight">
                      ₦1,245,000
                    </span>
                    <span className="text-[9px] text-slate-400">Total</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-1.5 text-xs">
                  {accountTypeBreakdown.map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] text-slate-600 font-medium truncate">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 ml-1">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900">Recent Transactions</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {mockupTransactions.map(tx => {
                  const Icon = tx.icon;
                  return (
                    <div key={tx.id} className="flex items-center justify-between text-xs py-0.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-md ${tx.iconColor} flex items-center justify-center shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block leading-tight">
                            {tx.title}{' '}
                            <span className="text-[10px] text-slate-400 font-normal">{tx.sub}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-bold block leading-tight ${
                            tx.isIncome ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {tx.amount}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{tx.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUMN 3 (Right): Quick Actions 2x2 & Complete Your Financial Picture */}
          <div className="lg:col-span-4 space-y-5">
            {/* Quick Actions (2x2 Grid) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-900 mb-3">Quick Actions</h3>

              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Record Income */}
                <button
                  onClick={() => setIsAddIncomeOpen(true)}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                    Record Income
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Add a new income</p>
                </button>

                {/* 2. Record Expense */}
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-rose-300 hover:bg-rose-50/30 transition-all text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center mb-2 font-bold text-sm">
                    −
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-900">
                    Record Expense
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Track your spending</p>
                </button>

                {/* 3. Add Account */}
                <button
                  onClick={() => setIsAddAccountOpen(true)}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
                    <Building className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                    Add Account
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Connect or add an account</p>
                </button>

                {/* 4. Create Goal */}
                <button
                  onClick={() => setIsCreateGoalOpen(true)}
                  className="p-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                    Create Goal
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Plan for your future</p>
                </button>
              </div>
            </div>

            {/* Complete Your Financial Picture Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <Target className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-extrabold text-slate-900">
                    Complete your financial picture
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Add more accounts, set goals and track your spending for better insights.
                  </p>
                </div>
              </div>

              {/* Progress bar and counter */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '40%' }} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-slate-400">
                    2 of 5 items completed
                  </span>
                  <button
                    onClick={() => showToast('Opening guided setup steps')}
                    className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Tab: Full Transactions View */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">All Account Transactions</h3>
            <button
              onClick={() => setActiveTab('accounts')}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              ← Back to Overview
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {mockupTransactions.map(tx => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{tx.title}</span>
                  <span className="text-[11px] text-slate-400">{tx.sub} • {tx.date}</span>
                </div>
                <span className={`font-bold text-sm ${tx.isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alternative Tab: Monthly Cash Flow View */}
      {activeTab === 'cashflow' && (
        <div className="space-y-6">
          {/* Header & Filter Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Monthly Cash Flow Breakdown
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed month-by-month trajectory of your operational inflows, burn rate, and net surplus.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
                Year 2025 (Monthly)
              </span>
              <button
                onClick={() => setActiveTab('accounts')}
                className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                ← Back to Accounts
              </button>
            </div>
          </div>

          {/* Monthly KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Current Month (Apr 2025)</span>
              <span className="text-xl font-extrabold text-emerald-700 block mt-1">+₦330,000</span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">↑ 22% vs. March</span>
            </div>

            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Avg. Monthly Inflow</span>
              <span className="text-xl font-extrabold text-slate-900 block mt-1">₦590,000</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Across last 4 months</span>
            </div>

            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Avg. Monthly Outflow</span>
              <span className="text-xl font-extrabold text-rose-600 block mt-1">₦315,000</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Operating expense baseline</span>
            </div>

            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Net Savings Rate</span>
              <span className="text-xl font-extrabold text-teal-700 block mt-1">50.8%</span>
              <span className="text-[11px] text-teal-600 font-semibold block mt-0.5">Healthy cash buffer</span>
            </div>
          </div>

          {/* Monthly Chart Visual */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Monthly Inflow vs. Outflow Trajectory
              </h4>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-600" />
                  <span className="text-slate-600">Inflow</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-rose-500" />
                  <span className="text-slate-600">Outflow</span>
                </div>
              </div>
            </div>

            {/* Monthly Bar Chart */}
            <div className="pt-4 pb-2">
              <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-48 border-b border-slate-200 px-2 pb-2">
                {[
                  { month: 'Jan 2025', inflow: 520000, outflow: 290000, net: 230000, inHeight: 74, outHeight: 41 },
                  { month: 'Feb 2025', inflow: 580000, outflow: 310000, net: 270000, inHeight: 82, outHeight: 44 },
                  { month: 'Mar 2025', inflow: 610000, outflow: 340000, net: 270000, inHeight: 87, outHeight: 48 },
                  { month: 'Apr 2025', inflow: 650000, outflow: 320000, net: 330000, inHeight: 93, outHeight: 45, isCurrent: true },
                  { month: 'May 2025', inflow: 700000, outflow: 330000, net: 370000, inHeight: 98, outHeight: 47, isProj: true },
                  { month: 'Jun 2025', inflow: 720000, outflow: 350000, net: 370000, inHeight: 100, outHeight: 50, isProj: true }
                ].map(item => (
                  <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-bold text-emerald-800 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      +₦{(item.net / 1000).toFixed(0)}k
                    </span>
                    <div className="flex items-end gap-1.5 sm:gap-2 h-full justify-center w-full">
                      <div
                        style={{ height: `${item.inHeight}%` }}
                        className={`w-3.5 sm:w-6 rounded-t-sm transition-all duration-300 ${
                          item.isProj ? 'bg-emerald-400/80 border border-dashed border-emerald-600' : 'bg-emerald-600'
                        }`}
                        title={`Inflow: ₦${item.inflow.toLocaleString()}`}
                      />
                      <div
                        style={{ height: `${item.outHeight}%` }}
                        className={`w-3.5 sm:w-6 rounded-t-sm transition-all duration-300 ${
                          item.isProj ? 'bg-rose-400/80 border border-dashed border-rose-600' : 'bg-rose-500'
                        }`}
                        title={`Outflow: ₦${item.outflow.toLocaleString()}`}
                      />
                    </div>
                    <span className={`text-[10px] mt-2 whitespace-nowrap ${item.isCurrent ? 'font-bold text-emerald-900 underline' : 'text-slate-500'}`}>
                      {item.month.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Month-by-Month Detailed Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Monthly Cash Flow Records
              </h4>
              <span className="text-xs text-slate-400">All amounts in Nigerian Naira (₦)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60">
                    <th className="py-2.5 px-4 font-semibold">Month</th>
                    <th className="py-2.5 px-4 font-semibold">Cash Inflow</th>
                    <th className="py-2.5 px-4 font-semibold">Cash Outflow</th>
                    <th className="py-2.5 px-4 font-semibold">Net Cash Flow</th>
                    <th className="py-2.5 px-4 font-semibold">Savings Margin</th>
                    <th className="py-2.5 px-4 font-semibold">Cumulative Balance</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { month: 'April 2025 (Current)', in: 650000, out: 320000, net: 330000, margin: '50.8%', cum: 1245000, status: 'Surplus' },
                    { month: 'March 2025', in: 610000, out: 340000, net: 270000, margin: '44.3%', cum: 915000, status: 'Surplus' },
                    { month: 'February 2025', in: 580000, out: 310000, net: 270000, margin: '46.5%', cum: 645000, status: 'Surplus' },
                    { month: 'January 2025', in: 520000, out: 290000, net: 230000, margin: '44.2%', cum: 375000, status: 'Surplus' }
                  ].map(row => (
                    <tr key={row.month} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{row.month}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">+₦{row.in.toLocaleString()}</td>
                      <td className="py-3 px-4 font-semibold text-rose-600">-₦{row.out.toLocaleString()}</td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">+₦{row.net.toLocaleString()}</td>
                      <td className="py-3 px-4 font-medium text-slate-600">{row.margin}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">₦{row.cum.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <AddIncomeModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        onSuccess={showToast}
        initialType="Salary"
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSuccess={showToast}
      />

      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onSuccess={showToast}
      />

      <CreateGoalModal
        isOpen={isCreateGoalOpen}
        onClose={() => setIsCreateGoalOpen(false)}
        onSuccess={showToast}
      />
    </div>
  );
};
