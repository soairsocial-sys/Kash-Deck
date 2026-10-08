import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { SecurityPatternVector, CurrencyWaveVector } from '../common/UiVectors';

export const InsightsScreen: React.FC = () => {
  const { insights, setCurrentScreen } = useFinancial();

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Financial Insights
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Objective diagnostic observations explaining what changed, the evidence behind it, and what actions to take.
        </p>
      </div>

      {/* Structured Insight Cards: What happened, Evidence, Explanation, Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {insights.map(item => {
          const isUrgent = item.impact === 'urgent';
          const isPositive = item.impact === 'positive';
          const isWarning = item.impact === 'warning';

          return (
            <div
              key={item.id}
              className="relative overflow-hidden bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="absolute right-0 bottom-0 w-28 h-14 pointer-events-none opacity-15">
                <CurrencyWaveVector className={isUrgent ? 'text-rose-600' : isPositive ? 'text-emerald-600' : 'text-amber-600'} />
              </div>
              <div className="relative z-10">
                {/* Top Badge & Date */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isUrgent
                        ? 'bg-rose-100 text-rose-800'
                        : isPositive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isUrgent && <AlertTriangle className="w-3 h-3" />}
                    {isPositive && <CheckCircle2 className="w-3 h-3" />}
                    {isWarning && <TrendingUp className="w-3 h-3" />}
                    <span className="capitalize">{item.category} Insight</span>
                  </span>

                  <span className="text-[11px] font-medium text-slate-400">
                    {item.date}
                  </span>
                </div>

                {/* Insight Title */}
                <h3 className="text-sm font-bold text-slate-900 mt-2.5">
                  {item.title}
                </h3>

                {/* Structured Breakdown Blocks */}
                <div className="mt-2.5 space-y-2 text-xs">
                  {/* What Happened */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      1. What Happened
                    </span>
                    <p className="text-slate-800 font-semibold mt-0.5 text-xs">
                      {item.whatHappened}
                    </p>
                  </div>

                  {/* Evidence */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      2. Evidence
                    </span>
                    <p className="text-slate-700 mt-0.5 text-xs leading-relaxed">
                      {item.evidence}
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      3. Why It Occurred
                    </span>
                    <p className="text-slate-700 mt-0.5 text-xs leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80">
                    <div className="flex items-center gap-1 text-emerald-900 font-bold">
                      <Lightbulb className="w-3 h-3 text-emerald-700" />
                      <span className="text-[10px] uppercase tracking-wider">Recommended Action</span>
                    </div>
                    <p className="text-emerald-950 font-medium mt-0.5 text-xs leading-relaxed">
                      {item.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    if (item.category === 'business') setCurrentScreen('business');
                    else if (item.category === 'savings') setCurrentScreen('goals');
                    else setCurrentScreen('money');
                  }}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Review related ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
