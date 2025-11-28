import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { WishItem } from '../types/wishItem';

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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-5 mb-6 border-2 border-red-300 shadow-md"
    >
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title *"
          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:border-red-500"
          required
        />
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Link (optional)"
          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:border-red-500"
        />
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (optional)"
          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:border-red-500"
        />
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL (optional)"
          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:border-red-500"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:border-red-500"
          rows={3}
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-green-500 text-white font-semibold rounded-md hover:from-red-600 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Wish Item
        </button>
      </div>
    </form>
  );
}

