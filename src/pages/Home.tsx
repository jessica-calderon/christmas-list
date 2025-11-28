import { useNavigate } from 'react-router-dom';
import { useChristmasStore } from '../store/useChristmasStore';

export default function Home() {
  const people = useChristmasStore((state) => state.getPeople());
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen pt-20">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <h1 className="text-4xl font-extrabold text-center tracking-tight flex items-center justify-center gap-3 text-gray-800 dark:text-gray-100">
          <span className="inline-block w-7 h-7">🎄</span>
          Family Christmas List 2025
          <span className="inline-block w-7 h-7">🎄</span>
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-1">
          Choose a Family Member
        </p>
        <div className="space-y-4">
          {people.map((person) => {
            const wishlistCount = person.wishlist.length;
            return (
              <div
                key={person.id}
                onClick={() => navigate(`/person/${person.id}`)}
                className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg rounded-xl px-5 py-4 border border-gray-200 dark:border-gray-700 hover:-translate-y-0.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer"
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {person.name}
                </h2>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-red-500">🎁</span>
                  <span>{wishlistCount} wishlist items</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
