import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ArrowLeft,
  Calendar,
  ChevronDown,
  ShoppingBag,
  Briefcase,
  Laptop,
  Percent,
  TrendingUp,
  HelpCircle,
  Building2,
  User,
  Plus,
  Check,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinancial } from '../../context/FinancialContext';
import { apiV1 } from '../../services/apiV1';
import { AddCustomerModal } from '../business/AddCustomerModal';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  initialType?: string;
}

const INCOME_TYPES = [
  {
    id: 'Sale',
    label: 'Sale',
    desc: 'Customer sale',
    icon: ShoppingBag,
    color: 'bg-emerald-50 text-emerald-700'
  },
  {
    id: 'Salary',
    label: 'Salary',
    desc: 'Employment income',
    icon: Briefcase,
    color: 'bg-blue-50 text-blue-700'
  },
  {
    id: 'Freelance',
    label: 'Freelance',
    desc: 'Project work',
    icon: Laptop,
    color: 'bg-purple-50 text-purple-700'
  },
  {
    id: 'Commission',
    label: 'Commission',
    desc: 'Sales commission',
    icon: Percent,
    color: 'bg-amber-50 text-amber-700'
  },
  {
    id: 'Business income',
    label: 'Business income',
    desc: 'Business revenue',
    icon: Building2,
    color: 'bg-teal-50 text-teal-700'
  },
  {
    id: 'Investment income',
    label: 'Investment income',
    desc: 'Investment returns',
    icon: TrendingUp,
    color: 'bg-indigo-50 text-indigo-700'
  },
  {
    id: 'Other',
    label: 'Other',
    desc: 'Other income',
    icon: HelpCircle,
    color: 'bg-slate-100 text-slate-700'
  }
];

export const AddIncomeModal: React.FC<AddIncomeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialType
}) => {
  const { activeWorkspace } = useAuth();
  const { accounts: localAccounts, customers: localCustomers, recordBusinessSale, addTransaction } = useFinancial();

  const isBusiness = activeWorkspace?.type === 'business';

  // Form State
  const [amount, setAmount] = useState('');
  const [incomeType, setIncomeType] = useState<string>(
    initialType || (isBusiness ? 'Sale' : 'Salary')
  );
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'credit'>('paid');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [date, setDate] = useState<string>('Today');

  // Customer selection for Sale
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialType) {
      setIncomeType(initialType);
    }
  }, [initialType]);

  useEffect(() => {
    if (localAccounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(localAccounts[0].id);
    }
  }, [localAccounts, selectedAccountId]);

  if (!isOpen) return null;

  const isSale = incomeType === 'Sale';
  const isCredit = isSale && paymentStatus === 'credit';

  // Recent customers matching showcase (Aisha Bello, John Mensah, Mike Stores)
  const defaultRecentCustomers = [
    { id: 'c-1', name: 'Aisha Bello' },
    { id: 'c-2', name: 'John Mensah' },
    { id: 'c-3', name: 'Mike Stores' }
  ];

  const recentCustomers = localCustomers.length > 0
    ? localCustomers.map(c => ({ id: c.id, name: c.name }))
    : defaultRecentCustomers;

  const filteredCustomers = recentCustomers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    if (isCredit && !selectedCustomerName && !selectedCustomerId) {
      setErrorMessage('Please select a customer for credit sales');
      return;
    }

    const selectedAcc = localAccounts.find(a => a.id === selectedAccountId) || localAccounts[0];
    const amountMinor = Math.round(cleanAmount * 100);

    setIsSubmitting(true);
    try {
      if (isSale) {
        // Business sale recording
        recordBusinessSale({
          business_id: activeWorkspace?.id || 'biz-01',
          customer_id: selectedCustomerId || undefined,
          customer_name: selectedCustomerName || (paymentStatus === 'paid' ? 'Cash Customer' : 'Debtor'),
          subtotal: cleanAmount,
          discount: 0,
          total: cleanAmount,
          paid_amount: paymentStatus === 'paid' ? cleanAmount : 0,
          outstanding_amount: paymentStatus === 'credit' ? cleanAmount : 0,
          status: paymentStatus === 'paid' ? 'paid' : 'unpaid',
          payment_method: paymentStatus === 'paid' ? 'Transfer' : 'Credit sale',
          items: [],
          sale_date: new Date().toISOString().split('T')[0],
          notes: `${incomeType} transaction`
        });
      } else {
        // Personal or general income ledger entry
        addTransaction({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `${incomeType} Deposit`,
          category: 'Income',
          amount: cleanAmount,
          accountId: selectedAcc?.id || 'acc-main',
          accountName: selectedAcc?.name || 'Main Account',
          type: 'income',
          status: 'Completed',
          isBusiness: isBusiness
        });
      }

      onSuccess?.(`${incomeType} of ₦${cleanAmount.toLocaleString()} recorded ✓`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to record income');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[92vh]">
        {/* Header */}
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
                {isSale ? 'Add Sale' : 'Record Income'}
              </h3>
              <p className="text-xs text-slate-500">
                {isSale
                  ? 'Record a customer sale or credit receivable.'
                  : 'Add a new income to your account.'}
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

        {/* Content: Form (left) & Reference Panel (right) matching showcase */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {/* LEFT: Main Input Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Amount Input */}
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

              {/* 2. Income Type Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Income type
                </label>
                <div className="relative">
                  <select
                    value={incomeType}
                    onChange={e => setIncomeType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white appearance-none"
                  >
                    {INCOME_TYPES.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 3. If Sale: Payment Status (Radio Paid vs Credit) matching showcase */}
              {isSale && (
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Payment status
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="radio"
                        name="payment_status"
                        checked={paymentStatus === 'paid'}
                        onChange={() => setPaymentStatus('paid')}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Paid</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="radio"
                        name="payment_status"
                        checked={paymentStatus === 'credit'}
                        onChange={() => setPaymentStatus('credit')}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Credit</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 4. If Credit or Customer specified: Customer Picker matching showcase */}
              {isSale && (
                <div className="space-y-1.5 relative">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Customer
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddCustomerModalOpen(true)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    >
                      + Add new customer
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search customer..."
                      value={selectedCustomerName || customerSearch}
                      onChange={e => {
                        setSelectedCustomerName('');
                        setSelectedCustomerId('');
                        setCustomerSearch(e.target.value);
                        setIsCustomerDropdownOpen(true);
                      }}
                      onFocus={() => setIsCustomerDropdownOpen(true)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Customer Dropdown with Recent Customers matching showcase */}
                  {isCustomerDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-20 space-y-1 text-xs">
                      <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Recent customers
                      </p>
                      <div className="max-h-40 overflow-y-auto space-y-0.5">
                        {filteredCustomers.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setSelectedCustomerId(c.id);
                              setSelectedCustomerName(c.name);
                              setIsCustomerDropdownOpen(false);
                            }}
                            className="w-full p-2 text-left hover:bg-emerald-50 rounded-lg flex items-center justify-between text-slate-800"
                          >
                            <span className="font-semibold">{c.name}</span>
                            {selectedCustomerName === c.name && (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomerDropdownOpen(false);
                            setIsAddCustomerModalOpen(true);
                          }}
                          className="w-full p-1.5 text-left text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add new customer</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Account Dropdown */}
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

              {/* 6. Date Input */}
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

              {/* Submit Button (Solid dark forest green #03443a) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#03443a] hover:bg-[#02332c] disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-xs transition-all flex items-center justify-center cursor-pointer"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : isSale
                    ? 'Add Sale'
                    : 'Add Income'}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Income Types Reference Sidebar matching showcase */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/50 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 mb-2">
              Income types
            </h4>
            <div className="space-y-2">
              {INCOME_TYPES.map(type => {
                const Icon = type.icon;
                const isSelected = incomeType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setIncomeType(type.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${type.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-900 block">
                        {type.label}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {type.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Submodal for creating customer */}
      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        onSuccess={custName => {
          setSelectedCustomerName(custName);
        }}
      />
    </div>
  );
};
