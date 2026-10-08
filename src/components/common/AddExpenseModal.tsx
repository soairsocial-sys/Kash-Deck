import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronRight,
  Utensils,
  Car,
  Lightbulb,
  ShoppingBag,
  HeartPulse,
  Film,
  Home,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinancial } from '../../context/FinancialContext';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const POPULAR_CATEGORIES = [
  {
    id: 'Food & Dining',
    label: 'Food & Dining',
    icon: Utensils,
    color: 'bg-emerald-50 text-emerald-700'
  },
  {
    id: 'Transport',
    label: 'Transport',
    icon: Car,
    color: 'bg-blue-50 text-blue-700'
  },
  {
    id: 'Utilities',
    label: 'Utilities',
    icon: Lightbulb,
    color: 'bg-amber-50 text-amber-700'
  },
  {
    id: 'Shopping',
    label: 'Shopping',
    icon: ShoppingBag,
    color: 'bg-purple-50 text-purple-700'
  },
  {
    id: 'Health',
    label: 'Health',
    icon: HeartPulse,
    color: 'bg-rose-50 text-rose-700'
  },
  {
    id: 'Entertainment',
    label: 'Entertainment',
    icon: Film,
    color: 'bg-pink-50 text-pink-700'
  },
  {
    id: 'Rent',
    label: 'Rent',
    icon: Home,
    color: 'bg-indigo-50 text-indigo-700'
  },
  {
    id: 'Other',
    label: 'Other',
    icon: HelpCircle,
    color: 'bg-slate-100 text-slate-700'
  }
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { activeWorkspace } = useAuth();
  const { accounts: localAccounts, addTransaction } = useFinancial();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [date, setDate] = useState('Today');
  const [isRecurring, setIsRecurring] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (localAccounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(localAccounts[0].id);
    }
  }, [localAccounts, selectedAccountId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    const selectedAcc = localAccounts.find(a => a.id === selectedAccountId) || localAccounts[0];

    setIsSubmitting(true);
    try {
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: `${category} expense`,
        category,
        amount: -cleanAmount,
        accountId: selectedAcc?.id || 'acc-main',
        accountName: selectedAcc?.name || 'Main Account',
        type: 'expense',
        status: 'Completed',
        notes: notes || (isRecurring ? 'Recurring monthly expense' : undefined),
        isBusiness: activeWorkspace?.type === 'business'
      });

      onSuccess?.(`Expense of ₦${cleanAmount.toLocaleString()} recorded ✓`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to record expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[92vh]">
        {/* Header matching showcase */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Record Expense
              </h3>
              <p className="text-xs text-slate-500">
                Add a new expense to your account.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: Form (left) & Popular Categories (right) matching showcase */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {/* LEFT: Main Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₦
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setAmount(val);
                    }}
                    placeholder="Enter amount"
                    required
                    autoFocus
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              {/* 2. Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white appearance-none"
                  >
                    {POPULAR_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 3. Account Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account
                </label>
                <div className="relative">
                  <select
                    value={selectedAccountId}
                    onChange={e => setSelectedAccountId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white appearance-none"
                  >
                    {localAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.bankName || acc.type})
                      </option>
                    ))}
                    {localAccounts.length === 0 && (
                      <option value="main">Operating Cash / Main Account</option>
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 4. Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 5. Recurring Toggle matching showcase */}
              <div className="flex items-center justify-between py-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700">
                  Recurring (optional)
                </span>
                <button
                  type="button"
                  onClick={() => setIsRecurring(!isRecurring)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isRecurring ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                      isRecurring ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* 6. More Details link matching showcase */}
              <button
                type="button"
                onClick={() => setShowMoreDetails(!showMoreDetails)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <span>More details</span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    showMoreDetails ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {showMoreDetails && (
                <div className="pt-1 animate-in fade-in">
                  <textarea
                    rows={2}
                    placeholder="Add notes, merchant details, or receipt tag..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              )}

              {/* Submit button (Solid dark forest green #03443a) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#03443a] hover:bg-[#02332c] disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-xs transition-all flex items-center justify-center cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Popular Categories Reference Panel matching showcase */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/50 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 mb-2">
              Popular categories
            </h4>
            <div className="space-y-2">
              {POPULAR_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
