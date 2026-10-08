import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  Building2,
  Banknote,
  Wallet,
  CreditCard,
  TrendingUp,
  Search,
  Check,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinancial } from '../../context/FinancialContext';
import { BankLogo } from './BankLogo';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

export interface BankItem {
  id: string;
  name: string;
  shortName: string;
  popular?: boolean;
}

const NIGERIAN_BANKS: BankItem[] = [
  // Popular
  { id: 'gtb', name: 'GTBank (Guaranty Trust Bank)', shortName: 'GTBank', popular: true },
  { id: 'access', name: 'Access Bank', shortName: 'Access Bank', popular: true },
  { id: 'firstbank', name: 'First Bank of Nigeria', shortName: 'First Bank', popular: true },
  { id: 'uba', name: 'United Bank for Africa', shortName: 'UBA', popular: true },
  { id: 'zenith', name: 'Zenith Bank', shortName: 'Zenith Bank', popular: true },

  // All Other Banks
  { id: 'sterling', name: 'Sterling Bank', shortName: 'Sterling Bank' },
  { id: 'standard_chartered', name: 'Standard Chartered Bank', shortName: 'Standard Chartered' },
  { id: 'suntrust', name: 'Suntrust Bank', shortName: 'Suntrust Bank' },
  { id: 'union', name: 'Union Bank of Nigeria', shortName: 'Union Bank' },
  { id: 'absa', name: 'Absa Bank Nigeria', shortName: 'Absa Bank' },
  { id: 'citibank', name: 'Citibank Nigeria', shortName: 'Citibank' },
  { id: 'fidelity', name: 'Fidelity Bank', shortName: 'Fidelity Bank' },
  { id: 'polaris', name: 'Polaris Bank', shortName: 'Polaris Bank' },
  { id: 'stanbic', name: 'Stanbic IBTC Bank', shortName: 'Stanbic IBTC' },
  { id: 'kuda', name: 'Kuda Microfinance Bank', shortName: 'Kuda Bank' },
  { id: 'opay', name: 'OPay Digital Services', shortName: 'OPay' },
  { id: 'palmpay', name: 'PalmPay', shortName: 'PalmPay' },
  { id: 'moniepoint', name: 'Moniepoint MFB', shortName: 'Moniepoint' }
];

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { activeWorkspace } = useAuth();
  const { addAccount } = useFinancial();

  // Steps: 'type' -> 'bank' -> 'details'
  const [step, setStep] = useState<'type' | 'bank' | 'details'>('type');
  const [selectedType, setSelectedType] = useState<'bank' | 'cash' | 'wallet' | 'card' | 'investment'>('bank');
  const [selectedBank, setSelectedBank] = useState<BankItem>(NIGERIAN_BANKS[0]);
  const [bankSearch, setBankSearch] = useState('');

  // Form Details
  const [accountName, setAccountName] = useState('John Doe');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [currentBalance, setCurrentBalance] = useState('230,000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const popularBanks = NIGERIAN_BANKS.filter(b => b.popular);
  const otherBanks = NIGERIAN_BANKS.filter(b => !b.popular);

  const filteredPopular = popularBanks.filter(b =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
    b.shortName.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const filteredOther = otherBanks.filter(b =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
    b.shortName.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleContinueFromType = () => {
    if (selectedType === 'bank') {
      setStep('bank');
    } else {
      if (selectedType === 'cash') setAccountName('Cash on Hand');
      else if (selectedType === 'wallet') setAccountName('Digital Wallet');
      else if (selectedType === 'card') setAccountName('Debit / Credit Card');
      else setAccountName('Investment Portfolio');
      setStep('details');
    }
  };

  const handleSelectBank = (bank: BankItem) => {
    setSelectedBank(bank);
    setAccountName(bank.shortName);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanBalance = parseFloat(currentBalance.replace(/,/g, '')) || 0;

    addAccount({
      name: accountName.trim() || 'New Account',
      bankName: selectedType === 'bank' ? selectedBank.shortName : (selectedType === 'cash' ? 'Cash' : accountName),
      type: selectedType,
      balance: cleanBalance,
      currency: 'NGN',
      status: 'active',
      accountNumber: accountNumber.trim() || undefined,
      isBusiness: activeWorkspace?.type === 'business'
    });

    setIsSubmitting(false);
    onSuccess?.(`Account added ✓ ${accountName}`);
    onClose();
  };

  const accountTypeOptions = [
    { id: 'bank' as const, label: 'Bank account', icon: Building2 },
    { id: 'cash' as const, label: 'Cash', icon: Banknote },
    { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
    { id: 'card' as const, label: 'Credit card', icon: CreditCard },
    { id: 'investment' as const, label: 'Investment', icon: TrendingUp }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step !== 'type' && (
              <button
                type="button"
                onClick={() => {
                  if (step === 'details') {
                    if (selectedType === 'bank') setStep('bank');
                    else setStep('type');
                  } else {
                    setStep('type');
                  }
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {step === 'type' && 'Add Account'}
                {step === 'bank' && 'Choose your bank'}
                {step === 'details' && 'Bank Account Details'}
              </h3>
              <p className="text-xs text-slate-500">
                {step === 'type' && 'Choose the type of account you want to add.'}
                {step === 'bank' && 'Select your Nigerian financial institution.'}
                {step === 'details' && 'Review details and initial balance.'}
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

        {/* STEP 1: Choose Type (matching showcase row 2 right) */}
        {step === 'type' && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            {/* Grid presentation matching showcase */}
            <div className="grid grid-cols-2 gap-3.5">
              {accountTypeOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = selectedType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedType(opt.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 shadow-xs'
                        : 'border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleContinueFromType}
                className="w-full py-3.5 px-6 bg-[#03443a] hover:bg-[#02332c] text-white rounded-xl text-sm font-bold shadow-xs transition-all flex items-center justify-center cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Bank (matching showcase row 3 left) */}
        {step === 'bank' && (
          <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Search banks..."
                value={bankSearch}
                onChange={e => setBankSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            </div>

            {/* Popular Banks section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Popular
              </h4>
              <div className="space-y-1.5">
                {filteredPopular.map(bank => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => handleSelectBank(bank)}
                    className="w-full p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/20 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <BankLogo bankName={bank.shortName} size="md" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-900">
                        {bank.shortName}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700" />
                  </button>
                ))}
              </div>
            </div>

            {/* All Banks section */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                All Banks
              </h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {filteredOther.map(bank => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => handleSelectBank(bank)}
                    className="w-full p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/20 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <BankLogo bankName={bank.shortName} size="md" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-900">
                        {bank.shortName}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Bank Account Details (matching showcase row 3 middle) */}
        {step === 'details' && (
          <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
            {/* Bank Badge */}
            {selectedType === 'bank' && selectedBank && (
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
                <BankLogo bankName={selectedBank.shortName} size="md" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {selectedBank.shortName}
                  </h4>
                  <p className="text-[11px] text-slate-400">Bank account</p>
                </div>
              </div>
            )}

            {/* Safety Notice Box matching showcase */}
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/70 rounded-2xl text-xs text-emerald-950 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-emerald-900">
                CashDeck tracks your account for financial management and reporting. We do not hold or move your money.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account name
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white font-medium"
                />
              </div>

              {selectedType === 'bank' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Account number
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current balance
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₦
                  </span>
                  <input
                    type="text"
                    value={currentBalance}
                    onChange={e => setCurrentBalance(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#03443a] hover:bg-[#02332c] text-white rounded-xl text-sm font-bold shadow-xs transition-all flex items-center justify-center cursor-pointer"
                >
                  {isSubmitting ? 'Adding...' : 'Add account'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
