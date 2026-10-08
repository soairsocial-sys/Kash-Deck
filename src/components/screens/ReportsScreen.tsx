import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  ChevronDown,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { CurrencyWaveVector, SecurityPatternVector } from '../common/UiVectors';

export const ReportsScreen: React.FC = () => {
  const { personalMetrics, businessMetrics, transactions, sales, dateRange } = useFinancial();

  const [reportType, setReportType] = useState<'personal' | 'business'>('personal');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (format: 'PDF' | 'Excel' | 'CSV') => {
    // Generate simulated export file
    const title = reportType === 'personal' ? 'CashDeck_Personal_P&L' : 'CashDeck_Business_Performance';
    const filename = `${title}_${new Date().toISOString().split('T')[0]}.${format === 'Excel' ? 'xlsx' : format.toLowerCase()}`;

    const dummyContent = format === 'CSV'
      ? `Date,Type,Category,Amount\n2026-10-02,Revenue,Sales,780000\n2026-10-01,Expense,Inventory,3600000\n`
      : `CashDeck Financial Statement - ${dateRange}\nReport: ${reportType.toUpperCase()}\nTotal Balance/Revenue: ₦${(reportType === 'personal' ? personalMetrics.totalBalance : businessMetrics.revenue).toLocaleString()}`;

    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(format);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Financial Reports & Statements
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-ready monthly summaries, income-vs-expenses statements, and multi-format exports.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleDownload('PDF')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleDownload('Excel')}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleDownload('CSV')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#047857] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Report exported successfully in {downloadSuccess} format.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setReportType('personal')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            reportType === 'personal'
              ? 'bg-[#047857] text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          Personal Financial Report
        </button>
        <button
          onClick={() => setReportType('business')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            reportType === 'business'
              ? 'bg-[#047857] text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          Business P&L Statement
        </button>
      </div>

      {/* Report Summary Card */}
      {reportType === 'personal' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="relative overflow-hidden bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Monthly Inflow</span>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">₦850,000</p>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">Salary & returns</span>
            </div>
            <div className="relative overflow-hidden bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Monthly Outflow</span>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">₦420,000</p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Living & discretionary</span>
            </div>
            <div className="relative overflow-hidden bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs">
              <div className="absolute right-0 bottom-0 w-20 h-10 pointer-events-none opacity-15">
                <CurrencyWaveVector className="text-emerald-600" />
              </div>
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Savings Rate</span>
              <p className="text-xl sm:text-2xl font-bold text-emerald-700 tracking-tight mt-0.5">35.3%</p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">₦300,000 preserved</span>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#065f46] to-[#047857] text-white rounded-xl p-3.5 sm:p-4 shadow-2xs">
              <div className="absolute -right-4 -top-4 w-16 h-16 pointer-events-none opacity-20">
                <SecurityPatternVector className="text-emerald-100" />
              </div>
              <span className="text-[11px] text-emerald-200 font-medium uppercase tracking-wider block">Calculated Net Worth</span>
              <p className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">₦9,709,000</p>
              <span className="text-[10px] text-emerald-200 mt-0.5 block">Liquid cash + Portfolio</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/70 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Personal Cash Flow Summary ({dateRange})
            </h3>
            <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="p-2.5 sm:p-3 bg-slate-50 font-bold text-slate-700 flex justify-between text-[11px] uppercase tracking-wider">
                <span>Account Flow Category</span>
                <span>Amount (₦)</span>
              </div>
              <div className="p-2.5 sm:p-3 flex justify-between">
                <span>Gross Inflow (Salary & Transfers)</span>
                <span className="font-bold text-emerald-700">+₦850,000</span>
              </div>
              <div className="p-2.5 sm:p-3 flex justify-between">
                <span>Essential Expenses (Housing, Utilities, Groceries)</span>
                <span className="font-bold text-slate-800">-₦285,600</span>
              </div>
              <div className="p-2.5 sm:p-3 flex justify-between">
                <span>Discretionary Spending (Shopping, Transport, Dining)</span>
                <span className="font-bold text-slate-800">-₦134,400</span>
              </div>
              <div className="p-2.5 sm:p-3 flex justify-between bg-emerald-50/50">
                <span className="font-bold text-emerald-950">Net Personal Savings Retained</span>
                <span className="font-extrabold text-emerald-800">+₦430,000</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Total Revenue</span>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">₦{businessMetrics.revenue.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">{businessMetrics.salesCount} verified sales</span>
            </div>
            <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Operating Expenses</span>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">₦{businessMetrics.operatingExpenses.toLocaleString()}</p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{businessMetrics.expensesCount} operating expenses</span>
            </div>
            <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Net Profit</span>
              <p className={`text-xl sm:text-2xl font-bold mt-0.5 ${businessMetrics.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                ₦{businessMetrics.netProfit.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">Margin: {businessMetrics.profitMargin}%</span>
            </div>
            <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Net Cash Flow</span>
              <p className={`text-xl sm:text-2xl font-bold mt-0.5 ${businessMetrics.netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                ₦{businessMetrics.netCashFlow.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-500 mt-0.5 block">₦{businessMetrics.cashInflow.toLocaleString()} in • ₦{businessMetrics.cashOutflow.toLocaleString()} out</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/70 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Business Statement of Profit & Loss ({dateRange})
            </h3>
            <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="p-2.5 sm:p-3 bg-slate-50 font-bold text-slate-700 flex justify-between text-[11px] uppercase tracking-wider">
                <span>P&L Line Item</span>
                <span>Amount (₦)</span>
              </div>
              <div className="p-2.5 sm:p-3 flex justify-between">
                <span>Gross Revenue from Sales</span>
                <span className="font-bold text-emerald-700">+₦{businessMetrics.revenue.toLocaleString()}</span>
              </div>
              <div className="p-2.5 sm:p-3 flex justify-between">
                <span>Cost of Goods Sold (Wholesale Inventory Sourcing)</span>
                <span className="font-bold text-slate-800">-₦{businessMetrics.costOfGoodsSold.toLocaleString()}</span>
              </div>
              <div className="p-2.5 sm:p-3 flex justify-between bg-slate-50/50">
                <span className="font-semibold text-slate-800">Gross Operating Profit</span>
                <span className="font-bold text-emerald-800">₦{businessMetrics.grossProfit.toLocaleString()}</span>
              </div>
              <div className="p-2.5 sm:p-3 flex justify-between">
                <span>Operating Expenses (Rent, Utilities, Shipping, Dispatch)</span>
                <span className="font-bold text-rose-700">-₦{businessMetrics.operatingExpenses.toLocaleString()}</span>
              </div>
              <div className="p-2.5 sm:p-3 flex justify-between bg-emerald-50/50">
                <span className="font-bold text-emerald-950">Net Operating Profit</span>
                <span className={`font-extrabold ${businessMetrics.netProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                  ₦{businessMetrics.netProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
