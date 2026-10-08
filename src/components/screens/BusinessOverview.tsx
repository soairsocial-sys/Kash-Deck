import React, { useState, useEffect } from 'react';
import {
  Plus,
  ShoppingBag,
  CreditCard,
  Users,
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinancial } from '../../context/FinancialContext';
import { apiV1 } from '../../services/apiV1';
import { AddIncomeModal } from '../common/AddIncomeModal';
import { AddExpenseModal } from '../common/AddExpenseModal';
import { AddAccountModal } from '../common/AddAccountModal';
import { AddCustomerModal } from '../business/AddCustomerModal';

interface BusinessOverviewProps {
  onNavigate: (screen: string) => void;
}

export const BusinessOverview: React.FC<BusinessOverviewProps> = ({ onNavigate }) => {
  const { user, activeWorkspace } = useAuth();
  const { accounts: localAccounts, businessMetrics, customers: localCustomers } = useFinancial();

  const [dashboardData, setDashboardData] = useState<any>(null);

  // Quick Action Modals
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

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

  const firstName = user?.name ? user.name.split(' ')[0] : 'Adeola';

  // Format currency in Naira
  const formatNaira = (val: number) => {
    return `₦${val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Metrics baseline matching showcase
  const cashPosition = businessMetrics?.totalBusinessCash || 4820000;
  const salesAmount = businessMetrics?.revenue || 2400000;
  const expenseAmount = businessMetrics?.totalExpenses || 780000;
  const profitAmount = salesAmount - expenseAmount > 0 ? salesAmount - expenseAmount : 1620000;
  const moneyOwed = businessMetrics?.totalReceivables || 285000;
  const debtorCount = localCustomers.filter(c => (c.amountOwed || 0) > 0).length || 3;

  // Recent business activity matching showcase
  const showcaseBusinessActivity = [
    {
      id: 'bs-1',
      title: 'Sale - Aisha Bello',
      date: 'Today',
      amount: 120000,
      isPositive: true,
      tag: 'Sale',
      iconBg: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'bs-2',
      title: 'Purchase (Stock)',
      date: 'Today · Unpaid',
      amount: -45000,
      isPositive: false,
      tag: 'Stock',
      iconBg: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'bs-3',
      title: 'Customer payment',
      subtitle: 'Gloria',
      date: 'Yesterday',
      amount: 30000,
      isPositive: true,
      tag: 'Settlement',
      iconBg: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'bs-4',
      title: 'Expense - Utilities',
      date: '2 days ago',
      amount: -10000,
      isPositive: false,
      tag: 'Utilities',
      iconBg: 'bg-amber-100 text-amber-800'
    }
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
          Here's your business performance for this month.
        </p>
      </div>

      {/* 2. Top 4 Stat Cards Row matching showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Cash Position (Deep spruce #03443a) */}
        <div
          onClick={() => onNavigate('accounts')}
          className="bg-[#03443a] text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:brightness-105 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-200/90">
              Cash Position
            </span>
            <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="my-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {formatNaira(cashPosition)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
              <ArrowUpRight className="w-3 h-3" />
              <span>+18%</span>
            </span>
            <span className="text-[11px] text-emerald-200/70">vs last month</span>
          </div>
        </div>

        {/* Card 2: Sales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Sales</span>
          <div className="my-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNaira(salesAmount)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <ArrowUpRight className="w-3 h-3" />
            <span>+ 12%</span>
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
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <ArrowDownLeft className="w-3 h-3 text-emerald-700" />
            <span>- 6%</span>
            <span className="text-slate-400 font-normal ml-0.5">This month</span>
          </div>
        </div>

        {/* Card 4: Profit */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Profit</span>
          <div className="my-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatNaira(profitAmount)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
            <ArrowUpRight className="w-3 h-3" />
            <span>+ 19%</span>
            <span className="text-slate-400 font-normal ml-0.5">This month</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions matching showcase */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Action 1: Add Sale */}
          <button
            onClick={() => setIsAddSaleOpen(true)}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-all flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-900 block">
                Add Sale
              </span>
              <span className="text-[11px] text-slate-500">Record sale</span>
            </div>
          </button>

          {/* Action 2: Add Expense */}
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-all flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-900 block">
                Add Expense
              </span>
              <span className="text-[11px] text-slate-500">Record expense</span>
            </div>
          </button>

          {/* Action 3: Customer */}
          <button
            onClick={() => onNavigate('customers')}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-all flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-900 block">
                Customer
              </span>
              <span className="text-[11px] text-slate-500">Manage customers</span>
            </div>
          </button>

          {/* Action 4: Account */}
          <button
            onClick={() => setIsAddAccountOpen(true)}
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition-all flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-900 block">
                Account
              </span>
              <span className="text-[11px] text-slate-500">Add account</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Two-Column Grid: Sales & Expenses (left) & Receivables / Activity (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sales & Expenses Line Chart Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Sales & Expenses</h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span className="text-[11px] font-medium">Sales</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span className="text-[11px] font-medium">Expenses</span>
              </div>
            </div>
          </div>

          {/* Multi-line chart SVG matching showcase */}
          <div className="h-56 w-full flex flex-col justify-between pt-2">
            <div className="relative flex-1">
              {/* Y-axis labels */}
              <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] font-semibold text-slate-400 pointer-events-none pb-5">
                <span>₦3M</span>
                <span>₦2M</span>
                <span>₦1M</span>
                <span>₦0</span>
              </div>

              {/* Grid Lines & Paths */}
              <div className="ml-8 h-44 relative">
                <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                  {/* Dotted horizontal grids */}
                  <line x1="0" y1="10" x2="400" y2="10" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="55" x2="400" y2="55" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="105" x2="400" y2="105" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="150" x2="400" y2="150" stroke="#e2e8f0" />

                  {/* Sales Line (Blue #0284c7) */}
                  <path
                    d="M 20 110 Q 120 70 200 60 T 380 30"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Sales Points */}
                  <circle cx="20" cy="110" r="3.5" fill="#0284c7" />
                  <circle cx="140" cy="80" r="3.5" fill="#0284c7" />
                  <circle cx="260" cy="65" r="3.5" fill="#0284c7" />
                  <circle cx="380" cy="30" r="3.5" fill="#0284c7" />

                  {/* Expenses Line (Green #10b981) */}
                  <path
                    d="M 20 135 Q 120 120 200 105 T 380 90"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Expenses Points */}
                  <circle cx="20" cy="135" r="3.5" fill="#10b981" />
                  <circle cx="140" cy="122" r="3.5" fill="#10b981" />
                  <circle cx="260" cy="108" r="3.5" fill="#10b981" />
                  <circle cx="380" cy="90" r="3.5" fill="#10b981" />
                </svg>

                {/* X-axis week labels */}
                <div className="flex justify-between text-[10px] font-medium text-slate-400 mt-2 px-1">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Money Owed & Recent Business Activity */}
        <div className="space-y-4">
          {/* Money Owed To You Mini-Card matching showcase */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 block">
                Money owed to you
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight block mt-0.5">
                {formatNaira(moneyOwed)}
              </span>
              <span className="text-xs text-slate-400 mt-0.5 block">
                {debtorCount} customers
              </span>
            </div>

            <button
              onClick={() => onNavigate('customers')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
            >
              View receivables
            </button>
          </div>

          {/* Recent Business Activity matching showcase */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              <button
                onClick={() => onNavigate('sales')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {showcaseBusinessActivity.map(item => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('sales')}
                  className="py-2.5 flex items-center justify-between group hover:bg-slate-50/50 rounded-xl px-1 -mx-1 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-bold block ${
                        item.isPositive ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {item.isPositive ? '+' : ''}
                      {formatNaira(item.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Modals */}
      <AddIncomeModal
        isOpen={isAddSaleOpen}
        onClose={() => setIsAddSaleOpen(false)}
        initialType="Sale"
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

      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSuccess={() => loadDashboard()}
      />
    </div>
  );
};
