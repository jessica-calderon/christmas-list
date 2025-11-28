import { useState } from 'react';
import { Pencil, Trash2, Save, X, ExternalLink } from 'lucide-react';
import type { WishItem } from '../types/wishItem';

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
    <div className="bg-white rounded-xl p-5 border-2 border-red-300 hover:border-red-400 transition-all duration-200 shadow-md hover:shadow-lg">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:border-red-500"
            placeholder="Title *"
          />
          <input
            type="url"
            value={editLink}
            onChange={(e) => setEditLink(e.target.value)}
            className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:border-red-500"
            placeholder="Link (optional)"
          />
          <input
            type="text"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:border-red-500"
            placeholder="Price (optional)"
          />
          <input
            type="url"
            value={editImage}
            onChange={(e) => setEditImage(e.target.value)}
            className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:border-red-500"
            placeholder="Image URL (optional)"
          />
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:border-red-500"
            placeholder="Notes (optional)"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          {item.image && (
            <div className="flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg border-2 border-red-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h3>
            {item.price && (
              <p className="text-green-600 font-semibold mb-1">${item.price}</p>
            )}
            {item.notes && (
              <p className="text-sm text-gray-600 mb-2">{item.notes}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {item.link && (
                <button
                  onClick={handleOpenLink}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Link
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                aria-label="Edit wish item"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-red-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                aria-label="Delete wish item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

