import React, { useState } from 'react';
import {
  Home,
  Receipt,
  Landmark,
  Target,
  ShoppingBag,
  CreditCard,
  Package,
  Users,
  Truck,
  FileSpreadsheet,
  TrendingUp,
  Settings,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Plus,
  User,
  Building2,
  LogOut,
  MoreHorizontal,
  X,
  PiggyBank,
  Check,
  Search,
  Bell,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinancial } from '../../context/FinancialContext';
import { AddIncomeModal } from './AddIncomeModal';
import { AddExpenseModal } from './AddExpenseModal';
import { AddAccountModal } from './AddAccountModal';
import { CreateGoalModal } from './CreateGoalModal';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';

interface WorkspaceShellProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onAddNewWorkspace: (type: 'personal' | 'business') => void;
  children: React.ReactNode;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  currentScreen,
  onNavigate,
  onAddNewWorkspace,
  children
}) => {
  const { user, activeWorkspace, workspaces, switchActiveWorkspace, logout } = useAuth();
  const { personalMetrics, businessMetrics, accounts } = useFinancial();

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Quick Action Modal states
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);

  // Toast / Confirmation feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const isBusiness = activeWorkspace?.type === 'business';

  const handleSelectWorkspace = async (wsId: string) => {
    setIsSwitcherOpen(false);
    if (wsId !== activeWorkspace?.id) {
      await switchActiveWorkspace(wsId);
      onNavigate('overview');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#edf4f0] text-slate-800 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-slate-700 animate-in slide-in-from-top-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* DESKTOP SIDEBAR - Matches Mockup */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-slate-200/80 p-4 shrink-0 justify-between select-none">
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#047857] to-[#10b981] flex items-center justify-center text-white shadow-xs">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">CashDeck</span>
          </div>

          {/* Primary Navigation List */}
          <nav className="space-y-1">
            {/* 1. Home */}
            <button
              onClick={() => onNavigate('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentScreen === 'overview'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className={`w-4 h-4 ${currentScreen === 'overview' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span className="flex-1 text-left">Home</span>
            </button>

            {/* 2. Activity */}
            <button
              onClick={() => onNavigate('transactions')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentScreen === 'transactions' || currentScreen === 'activity'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Receipt className={`w-4 h-4 ${currentScreen === 'transactions' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span className="flex-1 text-left">Activity</span>
            </button>

            {/* 3. Money */}
            <button
              onClick={() => onNavigate('money')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentScreen === 'money' || currentScreen === 'accounts' || currentScreen === 'cashflow'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Landmark className={`w-4 h-4 ${currentScreen === 'money' || currentScreen === 'accounts' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span className="flex-1 text-left">Money</span>
            </button>

            {/* 4. Sales */}
            <button
              onClick={() => onNavigate('sales')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentScreen === 'sales'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${currentScreen === 'sales' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span className="flex-1 text-left">Sales</span>
            </button>

            {/* 5. Expenses */}
            <button
              onClick={() => onNavigate('expenses')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentScreen === 'expenses'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CreditCard className={`w-4 h-4 ${currentScreen === 'expenses' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span className="flex-1 text-left">Expenses</span>
            </button>

            {/* 6. Goals */}
            <button
              onClick={() => onNavigate('goals')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentScreen === 'goals'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Target className={`w-4 h-4 ${currentScreen === 'goals' ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span className="flex-1 text-left">Goals</span>
            </button>

            {/* 7. More */}
            <button
              onClick={() => onNavigate('reports')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentScreen === 'reports' || currentScreen === 'settings'
                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
                <span>More</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </nav>

          {/* Quick Action Shortcuts inside sidebar */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3.5 block mb-2">
              Quick Actions
            </span>
            <div className="grid grid-cols-2 gap-1.5 px-1">
              <button
                onClick={() => setIsAddIncomeOpen(true)}
                className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/70 text-[11px] font-bold flex items-center gap-1.5 justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isBusiness ? 'Sale' : 'Income'}</span>
              </button>

              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-900 border border-slate-200/70 text-[11px] font-bold flex items-center gap-1.5 justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-rose-600" />
                <span>Expense</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom User Info & Sign Out */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
              TA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Tunde A.</p>
              <p className="text-[10px] text-slate-400 truncate">tunde@example.ng</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header - Matches Mockup */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-200/80 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-30">
          {/* Left: Workspace Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-800 shrink-0">
                <User className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-bold text-slate-900">
                  {activeWorkspace?.name || 'Personal'}
                </span>
                <span className="block text-[10px] text-slate-400 capitalize">
                  {activeWorkspace?.type || 'personal'} workspace
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 ml-1.5 transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Workspace Switcher Dropdown */}
            {isSwitcherOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in">
                <p className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Workspace
                </p>
                <div className="max-h-56 overflow-y-auto px-1.5 space-y-0.5">
                  {workspaces.map(ws => {
                    const isCurrent = ws.id === activeWorkspace?.id;
                    const wsIsBiz = ws.type === 'business';
                    return (
                      <button
                        key={ws.id}
                        onClick={() => handleSelectWorkspace(ws.id)}
                        className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-50 text-emerald-950 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {wsIsBiz ? (
                            <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
                          ) : (
                            <User className="w-4 h-4 text-emerald-700 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <span className="truncate block font-bold">{ws.name}</span>
                            <span className="text-[10px] text-slate-400 block capitalize">
                              {ws.type} workspace
                            </span>
                          </div>
                        </div>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 px-2">
                  <button
                    onClick={() => {
                      setIsSwitcherOpen(false);
                      setIsCreateWorkspaceOpen(true);
                    }}
                    className="w-full py-2 px-2 text-left text-xs font-bold text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-xs xl:max-w-sm mx-4 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search transactions, accounts, categories..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-xs rounded-xl border border-slate-200/80 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Quick Action Buttons on Nav Bar - Record Income & Record Expense */}
          <div className="hidden sm:flex items-center gap-2 mr-3">
            {/* 1. Record Income */}
            <button
              onClick={() => setIsAddIncomeOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#047857] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Record Income</span>
            </button>

            {/* 2. Record Expense */}
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 rounded-xl text-xs font-bold shadow-2xs transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />
              <span>Record Expense</span>
            </button>
          </div>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => onNavigate('notifications')}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* User Profile Avatar & Name */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 pl-1 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-100">
                  <span>TA</span>
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition-colors">
                  Tunde A.
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">Tunde Adeyemi</p>
                    <p className="text-[11px] text-slate-400">tunde@cashdeck.ng</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onNavigate('settings');
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Screen View */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 transition-all">
          {children}
        </main>

        {/* ============================================================ */}
        {/* MOBILE BOTTOM NAVIGATION BAR */}
        {/* ============================================================ */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around z-40 shadow-lg">
          <button
            onClick={() => onNavigate('overview')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              currentScreen === 'overview' ? 'text-[#065f46] font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </button>

          <button
            onClick={() => onNavigate('money')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              currentScreen === 'money' || currentScreen === 'accounts' ? 'text-[#065f46] font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Landmark className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Money</span>
          </button>

          <button
            onClick={() => onNavigate('expenses')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              currentScreen === 'expenses' ? 'text-[#065f46] font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Expenses</span>
          </button>

          <button
            onClick={() => onNavigate('goals')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              currentScreen === 'goals' ? 'text-[#065f46] font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Goals</span>
          </button>

          <button
            onClick={() => setIsMoreSheetOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">More</span>
          </button>
        </div>

        {/* Mobile More Sheet */}
        {isMoreSheetOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-t-3xl p-6 border-t border-slate-200 max-h-[80vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  More Views & Tools
                </h3>
                <button
                  onClick={() => setIsMoreSheetOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onNavigate('transactions');
                    setIsMoreSheetOpen(false);
                  }}
                  className="p-3 rounded-2xl text-left text-xs font-semibold flex items-center gap-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-800"
                >
                  <Receipt className="w-4 h-4 text-emerald-700" />
                  <span>Activity</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('reports');
                    setIsMoreSheetOpen(false);
                  }}
                  className="p-3 rounded-2xl text-left text-xs font-semibold flex items-center gap-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-800"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>Reports</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setIsMoreSheetOpen(false);
                  }}
                  className="p-3 rounded-2xl text-left text-xs font-semibold flex items-center gap-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-800"
                >
                  <Settings className="w-4 h-4 text-emerald-700" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setIsMoreSheetOpen(false);
                    setIsCreateWorkspaceOpen(true);
                  }}
                  className="font-bold text-emerald-800 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Workspace</span>
                </button>

                <button
                  onClick={logout}
                  className="font-bold text-rose-600 flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Modals Mounted in Shell */}
      <AddIncomeModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
        onSuccess={showToast}
        initialType={isBusiness ? 'Sale' : 'Salary'}
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

      <CreateWorkspaceModal
        isOpen={isCreateWorkspaceOpen}
        onClose={() => setIsCreateWorkspaceOpen(false)}
        onSuccess={() => {
          showToast('Workspace created successfully ✓');
          onNavigate('overview');
        }}
      />
    </div>
  );
};
