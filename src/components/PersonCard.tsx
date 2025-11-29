import { useNavigate } from 'react-router-dom';
import type { Person } from '../types/person';

interface PersonCardProps {
  person: Person;
}

export default function PersonCard({ person }: PersonCardProps) {
  const navigate = useNavigate();
  const wishlistCount = person.wishlist.length;

  return (
    <div
      onClick={() => navigate(`/person/${person.id}`)}
      className="bg-white dark:bg-slate-800/40 rounded-xl p-6 shadow-md dark:shadow-xl border-2 border-red-500 dark:border-red-600 hover:border-green-500 dark:hover:border-green-400 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
    >
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{person.name}</h2>
      <p className="text-gray-600 dark:text-gray-300">
        🎁 <span className="font-semibold">{wishlistCount}</span> wishlist items
      </p>
    </div>
  );
}
