import React, { useState } from 'react';
import {
  Landmark,
  CreditCard,
  Wallet,
  TrendingUp,
  Plus,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { Account, AccountType } from '../../types';
import { BankLogo } from '../common/BankLogo';
import { AddAccountModal } from '../common/AddAccountModal';
import { CurrencyWaveVector, SecurityPatternVector, CardFlowVector } from '../common/UiVectors';

export const AccountsScreen: React.FC = () => {
  const {
    accounts,
    addAccount,
    setCurrentScreen,
    openDetail,
    setSelectedMoneyAccountId,
    refreshAccount,
    isSyncing,
    hideBalances
  } = useFinancial();

  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'business'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // New Manual Account state (for physical cash only)
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('Cash');
  const [type, setType] = useState<AccountType>('cash');
  const [initialBalance, setInitialBalance] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);

  const filteredAccounts = accounts.filter(a => {
    if (activeTab === 'personal') return !a.isBusiness;
    if (activeTab === 'business') return a.isBusiness;
    return true;
  });

  const totalBankBalance = filteredAccounts
    .filter(a => a.type === 'bank' || a.type === 'business')
    .reduce((s, a) => s + a.balance, 0);

  const totalCashBalance = filteredAccounts
    .filter(a => a.type === 'cash')
    .reduce((s, a) => s + a.balance, 0);

  const totalCardBalance = filteredAccounts
    .filter(a => a.type === 'card' || a.type === 'wallet')
    .reduce((s, a) => s + a.balance, 0);

  const handleCreateManualAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFloat(initialBalance);
    if (!accountName || isNaN(bal)) return;

    addAccount({
      name: accountName,
      bankName: bankName,
      type: type,
      balance: bal,
      currency: '₦',
      isBusiness: isBusiness,
      status: 'active',
      color: type === 'cash' ? '#047857' : '#6366f1'
    });

    setAccountName('');
    setInitialBalance('');
    setShowAddModal(false);
  };

  const handleOpenInMoney = (e: React.MouseEvent, accId: string) => {
    e.stopPropagation();
    setSelectedMoneyAccountId(accId);
    setCurrentScreen('money');
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connected Nigerian bank accounts, cards, mobile wallets and physical cash.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#047857] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Account</span>
          </button>
        </div>
      </div>

      {/* Info Banner: Tracked Financial Accounts Principle */}
      <div className="relative overflow-hidden p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50 via-emerald-50/80 to-teal-50/50 border border-emerald-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 pointer-events-none opacity-15">
          <SecurityPatternVector className="text-emerald-700" />
        </div>
        <div className="flex items-start sm:items-center gap-2.5 relative z-10">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">
              Tracked Financial Accounts
            </h4>
            <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
              CashDeck tracks balances for planning and never holds, transfers, or moves user funds.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowConnectModal(true)}
          className="text-xs font-bold text-emerald-900 hover:text-emerald-950 underline shrink-0 whitespace-nowrap relative z-10 self-start sm:self-center cursor-pointer"
        >
          Add tracked account →
        </button>
      </div>

      {/* Summary KPI Cards with responsive typography and vector flourishes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="relative overflow-hidden bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="absolute right-0 bottom-0 w-24 h-12 pointer-events-none opacity-15">
            <CurrencyWaveVector className="text-emerald-600" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bank Accounts</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Landmark className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-1 relative z-10">
            {hideBalances ? '₦••••••••' : `₦${totalBankBalance.toLocaleString()}`}
          </h3>
          <span className="text-[10px] text-slate-400 mt-0.5 block relative z-10">
            Across checking & current accounts
          </span>
        </div>

        <div className="relative overflow-hidden bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Cash on Hand</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-1">
            {hideBalances ? '₦••••••••' : `₦${totalCashBalance.toLocaleString()}`}
          </h3>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Physical notes & till balance
          </span>
        </div>

        <div className="relative overflow-hidden bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
          <div className="absolute right-0 bottom-0 w-20 h-10 pointer-events-none opacity-20">
            <CardFlowVector className="text-purple-600" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Wallets & Cards</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-1 relative z-10">
            {hideBalances ? '₦••••••••' : `₦${totalCardBalance.toLocaleString()}`}
          </h3>
          <span className="text-[10px] text-slate-400 mt-0.5 block relative z-10">
            Digital cards & mobile wallets
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5">
        {(['all', 'personal', 'business'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
              activeTab === tab
                ? 'bg-[#047857] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {tab} Accounts
          </button>
        ))}
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {filteredAccounts.map(acc => (
          <div
            key={acc.id}
            onClick={() => openDetail('account', acc)}
            className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 hover:border-emerald-300 hover:shadow-2xs transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <BankLogo bankName={acc.bankName} size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {acc.bankName}
                    </h4>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {acc.name} • {acc.type}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Tracked</span>
                </span>
              </div>

              <div className="mt-4">
                <span className="text-[11px] text-slate-400 font-medium">Tracked Balance</span>
                <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  {hideBalances ? '₦••••••••' : `₦${acc.balance.toLocaleString()}`}
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                {acc.maskedAccountNumber || (acc.accountNumber ? `•••• ${acc.accountNumber.slice(-4)}` : 'Active')}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={e => handleOpenInMoney(e, acc.id)}
                  className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 text-xs transition-colors cursor-pointer"
                >
                  <span>View in Money</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Quick Add Bank Card in Grid */}
        <div
          onClick={() => setShowConnectModal(true)}
          className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-emerald-50/20 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 group-hover:bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-2 transition-colors">
            <Plus className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
            Connect New Bank Account
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5 max-w-[200px]">
            Directly link GTBank, Access, UBA, Zenith, OPay, and more.
          </p>
        </div>
      </div>

      {/* Manual Cash Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Physical Cash Drawer</h3>
            <p className="text-xs text-slate-500">
              For bank accounts, use &apos;Connect Bank Account&apos; for automated balance and transaction retrieval.
            </p>
            <form onSubmit={handleCreateManualAccount} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Account / Till Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shop Cash Register, Petty Cash Envelope"
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Initial Cash Amount (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50000"
                  value={initialBalance}
                  onChange={e => setInitialBalance(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isBusinessCash"
                  checked={isBusiness}
                  onChange={e => setIsBusiness(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="isBusinessCash" className="font-medium text-slate-700">
                  Assign to Business workspace
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold"
                >
                  Save Cash Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </div>
  );
};
