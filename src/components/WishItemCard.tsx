import { useState } from 'react';
import { Pencil, Trash2, Save, X, ExternalLink } from 'lucide-react';
import type { WishItem } from '../types/wishItem';
import Card from './Card';
import GradientButton from './GradientButton';

interface WishItemCardProps {
  item: WishItem;
  onDelete: () => void;
  onEdit: (updatedItem: WishItem) => void;
}

export default function WishItemCard({
  item,
  onDelete,
  onEdit,
}: WishItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editLink, setEditLink] = useState(item.link || '');
  const [editPrice, setEditPrice] = useState(item.price || '');
  const [editNotes, setEditNotes] = useState(item.notes || '');
  const [editImage, setEditImage] = useState(item.image || '');

  const handleSave = () => {
    onEdit({
      ...item,
      title: editTitle,
      link: editLink.trim() || undefined,
      price: editPrice.trim() || undefined,
      notes: editNotes.trim() || undefined,
      image: editImage.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(item.title);
    setEditLink(item.link || '');
    setEditPrice(item.price || '');
    setEditNotes(item.notes || '');
    setEditImage(item.image || '');
    setIsEditing(false);
  };

  const handleOpenLink = () => {
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="p-5 sm:p-6">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 dark:bg-slate-700/50 dark:text-gray-100 transition-all duration-200"
              placeholder="Title *"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Link (optional)
            </label>
            <input
              type="url"
              value={editLink}
              onChange={(e) => setEditLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 dark:bg-slate-700/50 dark:text-gray-100 transition-all duration-200"
              placeholder="Link (optional)"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Price (optional)
            </label>
            <input
              type="text"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 dark:bg-slate-700/50 dark:text-gray-100 transition-all duration-200"
              placeholder="Price (optional)"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 dark:bg-slate-700/50 dark:text-gray-100 transition-all duration-200"
              placeholder="Image URL (optional)"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 dark:bg-slate-700/50 dark:text-gray-100 transition-all duration-200 resize-none"
              placeholder="Notes (optional)"
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white text-sm font-semibold rounded-xl transition-all duration-200"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          {item.image && (
            <div className="flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full sm:w-24 sm:h-24 h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg sm:text-xl text-gray-800 dark:text-gray-100 mb-2">
              {item.title}
            </h3>
            {item.price && (
              <p className="text-green-600 dark:text-green-400 font-semibold mb-2 text-lg">
                ${item.price}
              </p>
            )}
            {item.notes && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {item.notes}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {item.link && (
                <button
                  onClick={handleOpenLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Link
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                aria-label="Edit wish item"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                aria-label="Delete wish item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

