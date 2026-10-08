import React, { useState } from 'react';
import { X, User, Building2, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { createWorkspace } = useAuth();
  const [workspaceType, setWorkspaceType] = useState<'personal' | 'business'>('business');
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const name = workspaceName.trim();
    if (!name) {
      setErrorMessage('Please enter a workspace name');
      return;
    }

    setIsLoading(true);
    try {
      await createWorkspace(workspaceType, name);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create workspace');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Create New Workspace</h3>
            <p className="text-xs text-slate-500">Isolated ledger for separate personal or business tracking.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Workspace Type
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceType('personal');
                    if (!workspaceName || workspaceName === 'My Business') {
                      setWorkspaceName('Personal Finances');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    workspaceType === 'personal'
                      ? 'border-[#047857] bg-emerald-50/40 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <User className="w-4 h-4 text-emerald-700" />
                    {workspaceType === 'personal' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                  </div>
                  <span className="text-xs mt-2 font-bold">Personal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWorkspaceType('business');
                    if (!workspaceName || workspaceName === 'Personal Finances') {
                      setWorkspaceName('My Business');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    workspaceType === 'business'
                      ? 'border-teal-700 bg-teal-50/40 text-teal-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 className="w-4 h-4 text-teal-700" />
                    {workspaceType === 'business' && <Check className="w-3.5 h-3.5 text-teal-700" />}
                  </div>
                  <span className="text-xs mt-2 font-bold">Business</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
                placeholder={workspaceType === 'business' ? 'e.g. SOAIR Media, Ade Supermarket' : 'e.g. My Personal Finances'}
                required
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-[#047857] hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer"
              >
                {isLoading ? 'Creating workspace...' : 'Create workspace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
