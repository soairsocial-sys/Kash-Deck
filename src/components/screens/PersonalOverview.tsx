import React, { useState, useEffect } from 'react';
import {
  Plus,
  Receipt,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  Smartphone,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinancial } from '../../context/FinancialContext';
import { apiV1 } from '../../services/apiV1';
import { AddIncomeModal } from '../common/AddIncomeModal';
import { AddExpenseModal } from '../common/AddExpenseModal';
import { AddAccountModal } from '../common/AddAccountModal';

interface PersonalOverviewProps {
  onNavigate: (screen: string) => void;
}

export const PersonalOverview: React.FC<PersonalOverviewProps> = ({ onNavigate }) => {
  const { user, activeWorkspace } = useAuth();
  const { accounts: localAccounts, transactions: localTransactions } = useFinancial();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [cashFlowPeriod, setCashFlowPeriod] = useState('This month');
  const [isCashFlowDropdownOpen, setIsCashFlowDropdownOpen] = useState(false);

  // Quick Action Modals
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  const loadDashboard = async () => {
    if (!activeWorkspace) return;
    try {
      const data = await apiV1.getDashboard(activeWorkspace.id);
      setDashboardData(data);
    } catch {
      setDashboardData(null);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [activeWorkspace?.id]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Tunde';

  // Compute metrics from backend or showcase baseline
  const totalBalance = localAccounts.length > 0
    ? localAccounts.reduce((sum, a) => sum + (a.balance || 0), 0)
    : 1245000;

  const incomeAmount = localTransactions.filter(t => t.type === 'income').length > 0
    ? localTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Math.abs(t.amount || 0), 0)
    : 650000;

  const expenseAmount = localTransactions.filter(t => t.type === 'expense').length > 0
    ? localTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount || 0), 0)
    : 320000;

  const savedAmount = incomeAmount > expenseAmount ? incomeAmount - expenseAmount : 180000;

  const formatNaira = (val: number) => {
    return `₦${val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Recent activity matching showcase
  const showcaseActivity = [
    {
      id: 'tx-1',
      title: 'Salary',
      category: 'Income',
      date: 'Today',
      amount: 450000,
      isPositive: true,
      iconBg: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'tx-2',
      title: 'Groceries',
      category: 'Food & Dining',
      date: 'Today',
      amount: -25000,
      isPositive: false,
      iconBg: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'tx-3',
      title: 'Internet',
      category: 'Bills',
      date: 'Yesterday',
      amount: -12000,
      isPositive: false,
      iconBg: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'tx-4',
      title: 'Freelance',
      category: 'Income',
      date: '2 days ago',
      amount: 80000,
      isPositive: true,
      iconBg: 'bg-sky-100 text-sky-800'
    }
  ];

  // Bar chart period data matching showcase
  const barBuckets = [
    { label: '1-7', incomeHeight: 35, expenseHeight: 25 },
    { label: '8-14', incomeHeight: 50, expenseHeight: 40 },
    { label: '15-21', incomeHeight: 90, expenseHeight: 65 },
    { label: '22-28', incomeHeight: 60, expenseHeight: 45 },
    { label: '29-31', incomeHeight: 80, expenseHeight: 55 }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header matching showcase */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Good morning, {firstName}</span>
          <span className="text-2xl">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Here's your financial picture for today.
        </p>
      </div>

      {/* 2. Top 4 Stat Cards Row matching showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Balance / Net Worth (Deep spruce #03443a) */}
        <div className="bg-[#03443a] text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-emerald-200/90">
            Total Balance / Net Worth
          </span>
          <div className="my-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {formatNaira(totalBalance)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12%</span>
            </span>
            <span className="text-[11px] text-emerald-200/70">vs last month</span>
          </div>
        </div>

        {/* Card 2: Income */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Income</span>
          <div className="my-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNaira(incomeAmount)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <ArrowUpRight className="w-3 h-3" />
            <span>+ 8%</span>
            <span className="text-slate-400 font-normal ml-0.5">This month</span>
          </div>
        </div>

        {/* Card 3: Expenses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Expenses</span>
          <div className="my-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNaira(expenseAmount)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600">
            <ArrowDownLeft className="w-3 h-3" />
            <span>- 4%</span>
            <span className="text-slate-400 font-normal ml-0.5">This month</span>
          </div>
        </div>

        {/* Card 4: Saved */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Saved</span>
          <div className="my-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNaira(savedAmount)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <ArrowUpRight className="w-3 h-3" />
            <span>+ 15%</span>
            <span className="text-slate-400 font-normal ml-0.5">This month</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions matching showcase */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Action 1: Record Income */}
          <button
            onClick={() => setIsAddIncomeOpen(true)}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-all flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-900 block">
                Record Income
              </span>
              <span className="text-[11px] text-slate-500">Add income</span>
            </div>
          </button>

          {/* Action 2: Record Expense */}
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-all flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-900 block">
                Record Expense
              </span>
              <span className="text-[11px] text-slate-500">Add expense</span>
            </div>
          </button>

          {/* Action 3: Add Account */}
          <button
            onClick={() => setIsAddAccountOpen(true)}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-all flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 block">
                Add Account
              </span>
              <span className="text-[11px] text-slate-500">Track account</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Two-Column Grid: Cash Flow (left) & Recent Activity (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Cash Flow Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-slate-900">Cash Flow</h3>
              <div className="relative">
                <button
                  onClick={() => setIsCashFlowDropdownOpen(!isCashFlowDropdownOpen)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/60 transition-colors"
                >
                  <span>{cashFlowPeriod}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {isCashFlowDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10 text-xs">
                    {['This month', 'Last month', 'This quarter'].map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          setCashFlowPeriod(p);
                          setIsCashFlowDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Legend matching showcase */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]" />
                <span className="text-[11px] font-medium">Income</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
                <span className="text-[11px] font-medium">Expenses</span>
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart Area */}
          <div className="h-56 w-full flex flex-col justify-between pt-2">
            <div className="relative flex-1 flex items-end justify-between px-2 sm:px-6">
              {/* Horizontal dotted grid lines */}
              <div className="absolute inset-x-0 top-2 border-b border-dashed border-slate-100" />
              <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-100" />
              <div className="absolute inset-x-0 bottom-0 border-b border-slate-100" />

              {/* Y Axis Labels */}
              <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] font-semibold text-slate-400 pointer-events-none pb-1">
                <span>₦400k</span>
                <span>₦300k</span>
                <span>₦0</span>
              </div>

              {/* Bar Groups across date ranges 1-7, 8-14, 15-21, 22-28, 29-31 */}
              <div className="w-full pl-8 h-full flex items-end justify-around">
                {barBuckets.map((bucket, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="flex items-end gap-1.5 h-40">
                      {/* Income Bar (Teal) */}
                      <div
                        className="w-3.5 sm:w-4 bg-[#0d9488] rounded-t-sm transition-all duration-500 hover:brightness-110"
                        style={{ height: `${bucket.incomeHeight}%` }}
                        title="Income"
                      />
                      {/* Expense Bar (Coral) */}
                      <div
                        className="w-3.5 sm:w-4 bg-[#f87171] rounded-t-sm transition-all duration-500 hover:brightness-110"
                        style={{ height: `${bucket.expenseHeight}%` }}
                        title="Expenses"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">
                      {bucket.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
            <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {showcaseActivity.map(item => (
              <div
                key={item.id}
                onClick={() => onNavigate('transactions')}
                className="py-3 flex items-center justify-between group hover:bg-slate-50/50 rounded-xl px-1.5 -mx-1.5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                  >
                    {item.title === 'Salary' && <Landmark className="w-4 h-4" />}
                    {item.title === 'Groceries' && <ShoppingBag className="w-4 h-4" />}
                    {item.title === 'Internet' && <Smartphone className="w-4 h-4" />}
                    {item.title === 'Freelance' && <Receipt className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {item.category}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs sm:text-sm font-bold block ${
                      item.isPositive ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {item.isPositive ? '+' : ''}
                    {formatNaira(item.amount)}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Modals */}
      <AddIncomeModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        onSuccess={() => loadDashboard()}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSuccess={() => loadDashboard()}
      />

      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onSuccess={() => loadDashboard()}
      />
    </div>
  );
};
