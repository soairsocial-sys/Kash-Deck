import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowDown,
  Plus,
  MoreHorizontal,
  FileSpreadsheet,
  Repeat,
  Tag,
  ShoppingBag,
  Car,
  Wifi,
  Film,
  Utensils,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { AddExpenseModal } from '../common/AddExpenseModal';

export const ExpensesScreen: React.FC = () => {
  const { transactions } = useFinancial();

  // State
  const [activeTab, setActiveTab] = useState<'all' | 'recurring' | 'category'>('all');
  const [trendView, setTrendView] = useState<'weekly' | 'monthly'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [dateRangeDropdown, setDateRangeDropdown] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('Apr 1 – Apr 30');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mockup base transactions matching the UI design
  const defaultExpenses = [
    {
      id: 'exp-1',
      date: 'Apr 28, 2025',
      description: 'Supermarket',
      icon: Utensils,
      category: 'Food & Dining',
      categoryColor: 'bg-rose-500',
      account: 'GTBank',
      amount: 25000,
      status: 'Completed'
    },
    {
      id: 'exp-2',
      date: 'Apr 27, 2025',
      description: 'Uber Ride',
      icon: Car,
      category: 'Transport',
      categoryColor: 'bg-blue-500',
      account: 'GTBank',
      amount: 12300,
      status: 'Completed'
    },
    {
      id: 'exp-3',
      date: 'Apr 26, 2025',
      description: 'Airtime & Data',
      icon: Wifi,
      category: 'Utilities',
      categoryColor: 'bg-amber-500',
      account: 'Cash',
      amount: 8500,
      status: 'Completed'
    },
    {
      id: 'exp-4',
      date: 'Apr 24, 2025',
      description: 'Online Shopping',
      icon: ShoppingBag,
      category: 'Shopping',
      categoryColor: 'bg-purple-500',
      account: 'Access Bank',
      amount: 45000,
      status: 'Completed'
    },
    {
      id: 'exp-5',
      date: 'Apr 22, 2025',
      description: 'Netflix',
      icon: Film,
      category: 'Entertainment',
      categoryColor: 'bg-pink-500',
      account: 'GTBank',
      amount: 8500,
      status: 'Completed'
    }
  ];

  // Filtered expenses based on search
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return defaultExpenses;
    const q = searchQuery.toLowerCase();
    return defaultExpenses.filter(
      item =>
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.account.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Donut chart segments for Top Categories
  const categoriesData = [
    { name: 'Food & Dining', percentage: 34, color: '#f97316' },
    { name: 'Transport', percentage: 18, color: '#3b82f6' },
    { name: 'Utilities', percentage: 12, color: '#f59e0b' },
    { name: 'Shopping', percentage: 10, color: '#8b5cf6' },
    { name: 'Entertainment', percentage: 8, color: '#ec4899' },
    { name: 'Other', percentage: 18, color: '#14b8a6' }
  ];

  // SVG Donut geometry
  const radius = 58;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  // Bar chart trend values for Weekly
  const weeklyBars = [
    { label: 'Apr 7', lightHeight: 48, darkHeight: 68 },
    { label: 'Apr 14', lightHeight: 65, darkHeight: 88 },
    { label: 'Apr 21', lightHeight: 74, darkHeight: 92 },
    { label: 'Apr 28', lightHeight: 58, darkHeight: 78 }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Expenses</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track and manage what you spend on.</p>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#047857] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* 2. STAT SUMMARY CARDS (3 ACROSS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Expenses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 font-bold text-base shrink-0">
              −
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-medium text-slate-500">Total Expenses</span>
              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="text-2xl font-extrabold text-slate-900">₦320,000</span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                  <span>12%</span>
                  <span className="text-slate-400 font-normal ml-0.5">vs. last month</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: This Month */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Calendar className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-medium text-slate-500">This Month</span>
              <div className="mt-1">
                <span className="text-2xl font-extrabold text-slate-900">₦320,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Avg. Daily */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-medium text-slate-500">Avg. Daily</span>
              <div className="mt-1">
                <span className="text-2xl font-extrabold text-slate-900">₦10,667</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW: EXPENSE TREND & TOP CATEGORIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Expense Trend */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900">Expense Trend</h3>
            {/* Weekly / Monthly Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full text-xs">
              <button
                onClick={() => setTrendView('weekly')}
                className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  trendView === 'weekly'
                    ? 'bg-emerald-100/90 text-emerald-900 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTrendView('monthly')}
                className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  trendView === 'monthly'
                    ? 'bg-emerald-100/90 text-emerald-900 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Bar Chart Canvas with Y-axis */}
          <div className="pt-2 pb-2">
            <div className="flex items-stretch h-44">
              {/* Y Axis Labels */}
              <div className="flex flex-col justify-between text-[10px] font-medium text-slate-400 pr-3 pb-6 shrink-0 text-right w-12">
                <span>N200K</span>
                <span>N150K</span>
                <span>N100K</span>
                <span>N50K</span>
                <span>N0</span>
              </div>

              {/* Chart Grid & Bars */}
              <div className="flex-1 flex flex-col justify-between relative">
                {/* Horizontal gridlines */}
                <div className="absolute inset-x-0 top-0 border-b border-slate-100" />
                <div className="absolute inset-x-0 top-1/4 border-b border-slate-100" />
                <div className="absolute inset-x-0 top-2/4 border-b border-slate-100" />
                <div className="absolute inset-x-0 top-3/4 border-b border-slate-100" />
                <div className="absolute inset-x-0 bottom-6 border-b border-slate-200" />

                {/* Bars columns */}
                <div className="relative z-10 flex-1 grid grid-cols-4 items-end px-4 gap-4 pb-6">
                  {weeklyBars.map(bar => (
                    <div key={bar.label} className="flex flex-col items-center h-full justify-end group">
                      <div className="flex items-end gap-1.5 h-full justify-center">
                        {/* Light mint bar */}
                        <div
                          style={{ height: `${bar.lightHeight}%` }}
                          className="w-2.5 sm:w-3.5 bg-emerald-200/90 rounded-t-sm transition-all duration-300 group-hover:bg-emerald-300"
                        />
                        {/* Dark emerald bar */}
                        <div
                          style={{ height: `${bar.darkHeight}%` }}
                          className="w-2.5 sm:w-3.5 bg-[#065f46] rounded-t-sm transition-all duration-300 group-hover:bg-emerald-800"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 mt-2 absolute -bottom-5">
                        {bar.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Top Categories Donut Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-900">Top Categories</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto py-1">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth={strokeWidth}
                />
                {/* Segments */}
                {categoriesData.map((cat, idx) => {
                  const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                  accumulatedPercent += cat.percentage;
                  return (
                    <circle
                      key={idx}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke={cat.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 hover:opacity-85"
                    />
                  );
                })}
              </svg>

              {/* Inner Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                  ₦320,000
                </span>
                <span className="text-[10px] font-medium text-slate-400">Total</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="flex-1 w-full space-y-1.5 pl-2">
              {categoriesData.map(cat => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-600 truncate text-[11px] font-medium">{cat.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 ml-2">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: EXPENSES TABLE + RIGHT SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Expenses Table Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {/* Card Top Controls */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-5 border-b border-transparent">
              <button
                onClick={() => setActiveTab('all')}
                className={`text-xs font-semibold pb-1.5 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'all'
                    ? 'text-emerald-800 font-bold border-emerald-600'
                    : 'text-slate-500 hover:text-slate-800 border-transparent'
                }`}
              >
                All Expenses
              </button>
              <button
                onClick={() => setActiveTab('recurring')}
                className={`text-xs font-semibold pb-1.5 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'recurring'
                    ? 'text-emerald-800 font-bold border-emerald-600'
                    : 'text-slate-500 hover:text-slate-800 border-transparent'
                }`}
              >
                Recurring
              </button>
              <button
                onClick={() => setActiveTab('category')}
                className={`text-xs font-semibold pb-1.5 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'category'
                    ? 'text-emerald-800 font-bold border-emerald-600'
                    : 'text-slate-500 hover:text-slate-800 border-transparent'
                }`}
              >
                By Category
              </button>
            </div>

            {/* Search & Date Controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search expenses..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-lg border border-slate-200/80 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36 sm:w-44 transition-all"
                />
              </div>

              {/* Date Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDateRangeDropdown(!dateRangeDropdown)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
                >
                  <span>{selectedDateRange}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {dateRangeDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 text-xs">
                    {['Apr 1 – Apr 30', 'Mar 1 – Mar 31', 'Last 30 Days', 'This Quarter'].map(r => (
                      <button
                        key={r}
                        onClick={() => {
                          setSelectedDateRange(r);
                          setDateRangeDropdown(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-2.5 px-4 font-semibold">Date</th>
                  <th className="py-2.5 px-4 font-semibold">Description</th>
                  <th className="py-2.5 px-4 font-semibold">Category</th>
                  <th className="py-2.5 px-4 font-semibold">Account</th>
                  <th className="py-2.5 px-4 font-semibold">Amount</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredList.map(item => {
                  const Icon = item.icon;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{item.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-900">{item.description}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.categoryColor}`} />
                          <span className="text-slate-600 font-medium">{item.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{item.account}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₦{item.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => showToast(`Selected ${item.description}`)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Actions & Recent Categories */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 mb-2">Quick Actions</h3>

            {/* 1. Add Expense */}
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="w-full p-2.5 rounded-xl border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30 flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-900">
                  Add Expense
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
            </button>

            {/* 2. Add Recurring Expense */}
            <button
              onClick={() => showToast('Opening recurring expense setup')}
              className="w-full p-2.5 rounded-xl border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30 flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Repeat className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-900">
                  Add Recurring Expense
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
            </button>

            {/* 3. Browse Categories */}
            <button
              onClick={() => showToast('Filtering by categories')}
              className="w-full p-2.5 rounded-xl border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30 flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-900">
                  Browse Categories
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
            </button>

            {/* 4. View Reports */}
            <button
              onClick={() => showToast('Navigating to Reports')}
              className="w-full p-2.5 rounded-xl border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30 flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-900">
                  View Reports
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
            </button>
          </div>

          {/* Recent Categories Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900">Recent Categories</h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-slate-700">Food & Dining</span>
                </div>
                <span className="font-semibold text-slate-400 text-xs">12</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Car className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-slate-700">Transport</span>
                </div>
                <span className="font-semibold text-slate-400 text-xs">8</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-slate-700">Utilities</span>
                </div>
                <span className="font-semibold text-slate-400 text-xs">6</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-slate-700">Shopping</span>
                </div>
                <span className="font-semibold text-slate-400 text-xs">5</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Film className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-slate-700">Entertainment</span>
                </div>
                <span className="font-semibold text-slate-400 text-xs">3</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => showToast('Viewing all categories')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSuccess={showToast}
      />
    </div>
  );
};
