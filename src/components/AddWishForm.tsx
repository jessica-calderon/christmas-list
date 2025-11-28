import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { WishItem } from '../types/wishItem';
import Card from './Card';
import GradientButton from './GradientButton';

interface AddWishFormProps {
  onAdd: (item: WishItem) => void;
}

export default function AddWishForm({ onAdd }: AddWishFormProps) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const newItem: WishItem = {
        id: crypto.randomUUID(),
        title: title.trim(),
        link: link.trim() || undefined,
        price: price.trim() || undefined,
        notes: notes.trim() || undefined,
        image: image.trim() || undefined,
      };
      onAdd(newItem);
      setTitle('');
      setLink('');
      setPrice('');
      setNotes('');
      setImage('');
    }
  };

  const imageUrl = image.trim();

  return (
    <Card className="p-6 sm:p-8 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter wish item title"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 dark:bg-slate-700/50 dark:text-gray-100 dark:placeholder-gray-400 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Link (optional)
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 dark:bg-slate-700/50 dark:text-gray-100 dark:placeholder-gray-400 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Price (optional)
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., $29.99"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 dark:bg-slate-700/50 dark:text-gray-100 dark:placeholder-gray-400 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 dark:bg-slate-700/50 dark:text-gray-100 dark:placeholder-gray-400 transition-all duration-200"
            />
            {imageUrl && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 text-sm">Invalid image URL</div>';
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 dark:bg-slate-700/50 dark:text-gray-100 dark:placeholder-gray-400 transition-all duration-200 resize-none"
              rows={3}
            />
          </div>

          <GradientButton type="submit" className="w-full flex items-center justify-center gap-2" size="lg">
            <Plus className="w-5 h-5" />
            Add Wish Item
          </GradientButton>
        </div>
      </form>
    </Card>
  );
}

