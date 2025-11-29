import { useState, useEffect } from 'react';
import { X, Lock, Gift, Trash2, Eye } from 'lucide-react';
import Card from './Card';
import GradientButton from './GradientButton';
import { SANTA_PASSWORD } from '../config/santa';

interface SantaLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SantaLoginModal({ isOpen, onClose, onSuccess }: SantaLoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      // Focus the input when modal opens
      setTimeout(() => {
        const input = document.getElementById('santa-password-input');
        input?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password.trim()) {
      setError('Please enter the passphrase');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === SANTA_PASSWORD) {
        onSuccess();
        setPassword('');
        setError('');
        onClose();
      } else {
        setError('Incorrect passphrase. Only Santa can access Santa Mode!');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9998] bg-black animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
        onKeyDown={handleKeyDown}
      >
        <Card
          className="w-full max-w-md p-6 sm:p-8 animate-scale-in pointer-events-auto"
          onClick={(e) => e?.stopPropagation()}
        >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-green-500 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            🎅 Santa Mode 🎅
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">
            Enter Santa's secret passphrase to unlock special permissions
          </p>
        </div>

        {/* Features list */}
        <div className="mb-6 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
            <Eye className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">View Hidden Gifts</p>
              <p className="text-gray-400 text-xs">See gifts that others can't see</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
            <Trash2 className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Delete Anyone</p>
              <p className="text-gray-400 text-xs">Delete any person or wishlist item</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50">
            <Gift className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Full Access</p>
              <p className="text-gray-400 text-xs">Complete control over the list</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="santa-password-input" className="block text-sm font-semibold text-gray-300 mb-2">
              Secret Passphrase
            </label>
            <input
              id="santa-password-input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter passphrase..."
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-200"
              disabled={isSubmitting}
              autoComplete="off"
            />
            {error && (
              <p className="mt-2 text-sm text-red-400 animate-fade-in">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <GradientButton
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Checking...' : 'Enter Santa Mode'}
            </GradientButton>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white text-base sm:text-lg font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
        </Card>
      </div>
    </>
  );
}

