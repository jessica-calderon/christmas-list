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
      className="bg-white rounded-xl p-6 shadow-md border-2 border-red-500 hover:border-green-500 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{person.name}</h2>
      <p className="text-gray-600">
        🎁 <span className="font-semibold">{wishlistCount}</span> wishlist items
      </p>
    </div>
  );
}
