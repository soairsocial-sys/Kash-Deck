import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  ChevronDown,
  Calendar,
  Check,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinancial } from '../../context/FinancialContext';
import { AddCustomerModal } from './AddCustomerModal';

interface RecordSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RecordSaleModal: React.FC<RecordSaleModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { activeWorkspace } = useAuth();
  const { accounts, customers, recordBusinessSale } = useFinancial();

  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'credit'>('paid');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [date, setDate] = useState('Today');

  // Customer selection
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  if (!isOpen) return null;

  const defaultRecentCustomers = [
    { id: 'c-1', name: 'Aisha Bello' },
    { id: 'c-2', name: 'John Mensah' },
    { id: 'c-3', name: 'Mike Stores' }
  ];

  const recentCustomers = customers.length > 0
    ? customers.map(c => ({ id: c.id, name: c.name }))
    : defaultRecentCustomers;

  const filteredCustomers = recentCustomers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(cleanAmount) || cleanAmount <= 0) return;

    const selectedAcc = accounts.find(a => a.id === selectedAccountId) || accounts[0];

    setIsSubmitting(true);
    recordBusinessSale({
      business_id: activeWorkspace?.id || 'biz-01',
      customer_id: selectedCustomerId || undefined,
      customer_name: selectedCustomerName || (paymentStatus === 'paid' ? 'Walk-in Customer' : 'Debtor'),
      subtotal: cleanAmount,
      discount: 0,
      total: cleanAmount,
      paid_amount: paymentStatus === 'paid' ? cleanAmount : 0,
      outstanding_amount: paymentStatus === 'credit' ? cleanAmount : 0,
      status: paymentStatus === 'paid' ? 'paid' : 'unpaid',
      payment_method: paymentStatus === 'paid' ? 'Transfer' : 'Credit sale',
      items: [],
      sale_date: new Date().toISOString().split('T')[0],
      notes: `Sale of ₦${cleanAmount.toLocaleString()}`
    });

    setIsSubmitting(false);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/90 space-y-5 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Header matching showcase */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900">Add Sale</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form matching showcase row 2 left */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
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
                autoFocus
                required
                placeholder="Enter amount"
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>
          </div>

          {/* Income type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Income type
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value="Sale"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50/50 cursor-default"
              />
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Payment status: Radio Paid vs Credit */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-slate-700">
              Payment status
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="radio"
                  name="sale_payment_status"
                  checked={paymentStatus === 'paid'}
                  onChange={() => setPaymentStatus('paid')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Paid</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="radio"
                  name="sale_payment_status"
                  checked={paymentStatus === 'credit'}
                  onChange={() => setPaymentStatus('credit')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Credit</span>
              </label>
            </div>
          </div>

          {/* Customer picker matching showcase */}
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

          {/* Account */}
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
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.bankName || acc.type})
                  </option>
                ))}
                {accounts.length === 0 && (
                  <option value="main">Operating Cash / Main Account</option>
                )}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date */}
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-[#03443a] hover:bg-[#02332c] disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-xs transition-all flex items-center justify-center cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Add Sale'}
            </button>
          </div>
        </form>
      </div>

      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        onSuccess={custName => setSelectedCustomerName(custName)}
      />
    </div>
  );
};
