import React, { useState } from 'react';
import {
  ShieldCheck,
  Laptop,
  Building2,
  Car,
  Home,
  Plus,
  X
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';

export const GoalsScreen: React.FC = () => {
  const { goals: contextGoals, addGoal, openDetail } = useFinancial();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('Dec 2026');

  // Baseline goals matching showcase screenshot exactly
  const showcaseGoals = [
    {
      id: 'g-1',
      name: 'Emergency Fund',
      currentAmount: 300000,
      targetAmount: 1000000,
      targetDate: 'Dec 2025',
      icon: ShieldCheck,
      iconColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'g-2',
      name: 'New Laptop',
      currentAmount: 450000,
      targetAmount: 1200000,
      targetDate: 'Mar 2026',
      icon: Laptop,
      iconColor: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'g-3',
      name: 'Business Expansion',
      currentAmount: 0,
      targetAmount: 3000000,
      targetDate: 'Dec 2026',
      icon: Building2,
      iconColor: 'bg-blue-100 text-blue-800'
    }
  ];

  const activeGoals = contextGoals.length > 0
    ? contextGoals.map(g => ({
        id: g.id,
        name: g.name,
        currentAmount: g.currentAmount,
        targetAmount: g.targetAmount,
        targetDate: g.targetDate,
        icon: g.iconName === 'Laptop' ? Laptop : (g.iconName === 'Store' ? Building2 : ShieldCheck),
        iconColor: 'bg-emerald-100 text-emerald-800',
        rawGoal: g
      }))
    : showcaseGoals;

  const formatNaira = (val: number) => {
    return `₦${val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const t = parseFloat(targetAmount.replace(/,/g, ''));
    if (!goalName.trim() || isNaN(t) || t <= 0) return;

    addGoal({
      name: goalName.trim(),
      category: 'Savings',
      targetAmount: t,
      targetDate,
      iconName: 'ShieldCheck',
      color: '#047857'
    });

    setGoalName('');
    setTargetAmount('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header matching showcase */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Plan for your future.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#03443a] hover:bg-[#02332c] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Goal</span>
        </button>
      </div>

      {/* 2. Goals List matching showcase cards */}
      <div className="space-y-4">
        {activeGoals.map(goal => {
          const Icon = goal.icon;
          const progress = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          );

          return (
            <div
              key={goal.id}
              onClick={() => {
                if ((goal as any).rawGoal) openDetail('goal', (goal as any).rawGoal);
              }}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-emerald-300 transition-colors cursor-pointer group"
            >
              {/* Left Info Cluster */}
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${goal.iconColor} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                    {goal.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 mt-0.5">
                    <span className="text-emerald-800">{formatNaira(goal.currentAmount)}</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-500">{formatNaira(goal.targetAmount)}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Target date: {goal.targetDate}
                  </span>
                </div>
              </div>

              {/* Right Progress Cluster */}
              <div className="w-full sm:w-64 flex items-center gap-3">
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 min-w-8 text-right">
                  {progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/90 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Goal</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House Down Payment, New Equipment"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Target Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₦
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter target amount"
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Target Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dec 2026"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-[#03443a] hover:bg-[#02332c] text-white rounded-xl text-sm font-bold shadow-xs transition-all flex items-center justify-center cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
