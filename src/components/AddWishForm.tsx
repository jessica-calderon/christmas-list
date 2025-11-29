import { useState } from 'react';
import { Plus, Package, Link as LinkIcon } from 'lucide-react';
import type { WishItem } from '../types/wishItem';
import GradientButton from './GradientButton';
import ImageUploader from './ImageUploader';

interface AddWishFormProps {
  onAdd: (item: WishItem) => void;
}

type FormMode = 'individual' | 'external';

export default function AddWishForm({ onAdd }: AddWishFormProps) {
  const [mode, setMode] = useState<FormMode>('individual');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Individual Item fields
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState('');

  // External Link fields
  const [externalLink, setExternalLink] = useState('');
  const [externalNotes, setExternalNotes] = useState('');

  const handleModeChange = (newMode: FormMode) => {
    if (newMode === mode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setMode(newMode);
      setIsTransitioning(false);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'individual') {
      if (title.trim()) {
        const newItem: WishItem = {
          id: crypto.randomUUID(),
          title: title.trim(),
          link: link.trim() || '',
          notes: notes.trim() || '',
          image: image.trim() || '',
        };
        onAdd(newItem);
        setTitle('');
        setLink('');
        setNotes('');
        setImage('');
      }
    } else {
      // External Link mode
      if (externalLink.trim()) {
        let title = 'External List';
        try {
          const url = new URL(externalLink.trim());
          title = `External List: ${url.hostname}`;
        } catch {
          // If URL parsing fails, use the link itself as a fallback
          title = `External List: ${externalLink.trim().substring(0, 30)}${externalLink.trim().length > 30 ? '...' : ''}`;
        }
        
        const newItem: WishItem = {
          id: crypto.randomUUID(),
          title,
          link: externalLink.trim(),
          notes: externalNotes.trim() || '',
        };
        onAdd(newItem);
        setExternalLink('');
        setExternalNotes('');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-6">
      <div className="bg-slate-100 dark:bg-slate-900/40 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-xl">
        {/* Mode Toggle */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleModeChange('individual')}
              className={`
                relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl
                font-semibold text-sm transition-all duration-300
                border-2
                ${
                  mode === 'individual'
                    ? 'bg-gradient-to-r from-red-500/20 to-green-500/20 border-green-400/50 dark:border-green-400/50 text-slate-900 dark:text-white shadow-lg shadow-green-500/10'
                    : 'bg-white/50 dark:bg-slate-800/40 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-black/20 dark:hover:border-white/20 hover:text-gray-800 dark:hover:text-gray-300'
                }
              `}
            >
              <Package className="w-5 h-5" />
              Add Individual Item
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('external')}
              className={`
                relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl
                font-semibold text-sm transition-all duration-300
                border-2
                ${
                  mode === 'external'
                    ? 'bg-gradient-to-r from-red-500/20 to-green-500/20 border-green-400/50 dark:border-green-400/50 text-slate-900 dark:text-white shadow-lg shadow-green-500/10'
                    : 'bg-white/50 dark:bg-slate-800/40 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-black/20 dark:hover:border-white/20 hover:text-gray-800 dark:hover:text-gray-300'
                }
              `}
            >
              <LinkIcon className="w-5 h-5" />
              Add Link to External List
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div
            className={`
              space-y-6
              transition-all duration-300 ease-in-out
              ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}
            `}
          >
            {mode === 'individual' ? (
              <>
                {/* Individual Item Mode */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter wish item title"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/40 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Link (optional)
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/40 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Image Upload (optional)
                  </label>
                  <ImageUploader value={image} onChange={setImage} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes..."
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/40 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200 resize-none"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                {/* External Link Mode */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Link *
                  </label>
                  <input
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://notes.apple.com/... or https://docs.google.com/... or https://amazon.com/... or https://pinterest.com/..."
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/40 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Supports iPhone Notes share links, Google Docs, Amazon lists, Pinterest boards, and other URLs
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={externalNotes}
                    onChange={(e) => setExternalNotes(e.target.value)}
                    placeholder="Add any additional notes about this list..."
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/40 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200 resize-none"
                    rows={3}
                  />
                </div>
              </>
            )}

            <GradientButton type="submit" className="w-full flex items-center justify-center gap-2 mt-8" size="lg">
              <Plus className="w-5 h-5" />
              {mode === 'individual' ? 'Add Wish Item' : 'Add External List Link'}
            </GradientButton>
          </div>
        </form>
      </div>
    </div>
  );
}
