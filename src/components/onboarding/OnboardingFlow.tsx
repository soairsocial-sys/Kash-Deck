import React, { useState } from 'react';
import {
  User,
  Building2,
  Check,
  ArrowRight,
  ArrowLeft,
  Building,
  Landmark,
  Banknote,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiV1 } from '../../services/apiV1';
import { AuthHeader } from '../common/AuthHeader';
import { BankLogo } from '../common/BankLogo';

interface OnboardingFlowProps {
  onFinished: (redirectUrl: string) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onFinished }) => {
  const { user, createWorkspace, saveOnboardingStep, completeOnboarding } = useAuth();

  // Internal Step State:
  // Step 1: 'choose_type' (Personal vs Business)
  // Step 2: 'basic_setup' (Name & Primary category)
  // Step 3: 'first_account' (Optional initial account)
  const [stepNumber, setStepNumber] = useState<1 | 2 | 3>(1);
  const [workspaceType, setWorkspaceType] = useState<'personal' | 'business'>('personal');

  // Step 2 Basic setup fields
  const [workspaceName, setWorkspaceName] = useState('');
  const [incomeSource, setIncomeSource] = useState('Salary');
  const [businessType, setBusinessType] = useState('Retail');

  // Step 3 First account fields
  const [accountCategory, setAccountCategory] = useState<'bank' | 'cash' | 'wallet'>('bank');
  const [bankName, setBankName] = useState('GTBank');
  const [accountLabel, setAccountLabel] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [startingBalance, setStartingBalance] = useState('');

  const [createdWorkspaceId, setCreatedWorkspaceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper to skip directly to dashboard
  const handleSkipToDashboard = async (targetType?: 'personal' | 'business') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const type = targetType || workspaceType;
      const defaultName = type === 'personal' ? 'Personal Finances' : (workspaceName.trim() || 'My Business');

      // 1. Create workspace if not created yet
      let wsId = createdWorkspaceId;
      if (!wsId) {
        const ws = await createWorkspace(type, defaultName);
        wsId = ws.id;
      }

      // 2. Mark onboarding completed immediately
      const res = await completeOnboarding();
      onFinished(res || (type === 'personal' ? '/app/personal/overview' : '/app/business/overview'));
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete setup');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1 -> Step 2
  const handleProceedToBasicSetup = () => {
    if (!workspaceName) {
      setWorkspaceName(workspaceType === 'personal' ? 'Personal Finances' : 'My Business');
    }
    setStepNumber(2);
  };

  // Step 2 -> Step 3 (Persist workspace only when choice confirmed)
  const handleConfirmBasicSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const name = workspaceName.trim() || (workspaceType === 'personal' ? 'Personal Finances' : 'My Business');
      // Create persistent workspace
      const ws = await createWorkspace(workspaceType, name);
      setCreatedWorkspaceId(ws.id);

      // Save answers
      if (workspaceType === 'personal') {
        await saveOnboardingStep('p1', { occupation: incomeSource, financialFocus: ['budgeting', 'savings'] });
      } else {
        await saveOnboardingStep('b1', { businessName: name, businessType });
      }

      setStepNumber(3);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize workspace');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 -> Finish
  const handleSaveFirstAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdWorkspaceId) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const bal = startingBalance ? parseFloat(startingBalance.replace(/,/g, '')) : 0;
      const openingBalanceMinor = Math.round(bal * 100);

      const name = accountLabel.trim() || (
        accountCategory === 'bank' ? `${bankName} Account` :
        accountCategory === 'cash' ? 'Cash on Hand' : 'Digital Wallet'
      );

      await apiV1.createAccount(createdWorkspaceId, {
        name,
        type: accountCategory,
        bankName: accountCategory === 'bank' ? bankName : undefined,
        accountNumber: accountNumber.trim() || undefined,
        openingBalanceMinor
      });

      const redirectUrl = await completeOnboarding();
      onFinished(redirectUrl || (workspaceType === 'personal' ? '/app/personal/overview' : '/app/business/overview'));
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add initial account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf4f0] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header with accurate progress */}
      <div className="max-w-2xl w-full mx-auto">
        <AuthHeader
          onBack={stepNumber > 1 ? () => setStepNumber((stepNumber - 1) as any) : undefined}
          currentStep={stepNumber}
          totalSteps={3}
        />
      </div>

      <main className="max-w-xl w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1: WHAT ARE YOU MANAGING? */}
          {/* ========================================================================= */}
          {stepNumber === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Step 1 of 3
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                  What are you managing?
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  Choose what you want to set up first. You can add more workspaces anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Personal Option */}
                <div
                  role="radio"
                  aria-checked={workspaceType === 'personal'}
                  tabIndex={0}
                  onClick={() => setWorkspaceType('personal')}
                  onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && setWorkspaceType('personal')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                    workspaceType === 'personal'
                      ? 'border-[#047857] bg-emerald-50/30 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      workspaceType === 'personal' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    {workspaceType === 'personal' && (
                      <div className="w-5 h-5 rounded-full bg-[#047857] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Personal</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Track salary, daily expenses, savings goals, and bank accounts.
                    </p>
                  </div>
                </div>

                {/* Business Option */}
                <div
                  role="radio"
                  aria-checked={workspaceType === 'business'}
                  tabIndex={0}
                  onClick={() => setWorkspaceType('business')}
                  onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && setWorkspaceType('business')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                    workspaceType === 'business'
                      ? 'border-[#047857] bg-emerald-50/30 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      workspaceType === 'business' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    {workspaceType === 'business' && (
                      <div className="w-5 h-5 rounded-full bg-[#047857] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Business</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Track sales, expenses, cash drawer, customers, and credit sales.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleProceedToBasicSetup}
                  className="w-full py-3.5 px-6 bg-[#047857] hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Section 5: Honest Skip Setup */}
                <button
                  type="button"
                  onClick={() => handleSkipToDashboard(workspaceType)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Skip setup & go to dashboard
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: MINIMUM SETUP */}
          {/* ========================================================================= */}
          {stepNumber === 2 && (
            <form onSubmit={handleConfirmBasicSetup} className="space-y-5">
              <div className="text-center mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Step 2 of 3
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                  {workspaceType === 'personal' ? 'Personal Setup' : 'Business Setup'}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  Just a couple of details to tailor your command center.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {workspaceType === 'personal' ? 'Workspace Name' : 'Business Name'}
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={e => setWorkspaceName(e.target.value)}
                  placeholder={workspaceType === 'personal' ? 'e.g. Personal Finances' : 'e.g. Ade Trading Co.'}
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {workspaceType === 'personal' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Income Source
                  </label>
                  <select
                    value={incomeSource}
                    onChange={e => setIncomeSource(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Salary">Salary (Monthly or bi-weekly)</option>
                    <option value="Freelance">Freelance / Consulting</option>
                    <option value="Business">Business owner drawings</option>
                    <option value="Commission">Sales Commission</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Business Type
                  </label>
                  <select
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Retail">Retail Store / Supermarket</option>
                    <option value="Services">Services / Agency</option>
                    <option value="Wholesale">Wholesale / Distribution</option>
                    <option value="Hospitality">Food / Restaurant / Bar</option>
                    <option value="Manufacturing">Production / Craft</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              <div className="pt-3 flex flex-col items-center gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 bg-[#047857] hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isLoading ? 'Setting up...' : 'Continue to First Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSkipToDashboard()}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Skip setup & go to dashboard
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: FIRST ACCOUNT (OPTIONAL) */}
          {/* ========================================================================= */}
          {stepNumber === 3 && (
            <form onSubmit={handleSaveFirstAccount} className="space-y-5">
              <div className="text-center mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Step 3 of 3 (Optional)
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                  Add Your First Account
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  Add an initial account to track. CashDeck only tracks balances; we never move your money.
                </p>
              </div>

              {/* Account Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountCategory('bank')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      accountCategory === 'bank'
                        ? 'border-[#047857] bg-emerald-50 text-emerald-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Bank
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountCategory('cash')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      accountCategory === 'cash'
                        ? 'border-[#047857] bg-emerald-50 text-emerald-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountCategory('wallet')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      accountCategory === 'wallet'
                        ? 'border-[#047857] bg-emerald-50 text-emerald-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Wallet
                  </button>
                </div>
              </div>

              {accountCategory === 'bank' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Bank
                  </label>
                  <select
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 bg-white"
                  >
                    <option value="GTBank">GTBank (Guaranty Trust Bank)</option>
                    <option value="Access Bank">Access Bank</option>
                    <option value="First Bank">First Bank of Nigeria</option>
                    <option value="UBA">United Bank for Africa (UBA)</option>
                    <option value="Zenith Bank">Zenith Bank</option>
                    <option value="Kuda">Kuda Microfinance Bank</option>
                    <option value="Stanbic IBTC">Stanbic IBTC Bank</option>
                    <option value="OPay">OPay</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Name
                </label>
                <input
                  type="text"
                  value={accountLabel}
                  onChange={e => setAccountLabel(e.target.value)}
                  placeholder={
                    accountCategory === 'bank' ? `${bankName} Checking` :
                    accountCategory === 'cash' ? 'Main Cash Drawer' : 'OPay Agency Wallet'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Starting Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₦
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={startingBalance}
                    onChange={e => setStartingBalance(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex items-center gap-2 text-[11px] text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>CashDeck only tracks financial balances and records. We never touch or hold funds.</span>
              </div>

              <div className="pt-2 flex flex-col items-center gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 bg-[#047857] hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer"
                >
                  {isLoading ? 'Saving...' : 'Add Account & Open Dashboard'}
                </button>

                <button
                  type="button"
                  onClick={() => handleSkipToDashboard()}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Skip for now & go to dashboard
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 py-3">
        CashDeck Financial Command Center • NDPA Compliant
      </footer>
    </div>
  );
};
