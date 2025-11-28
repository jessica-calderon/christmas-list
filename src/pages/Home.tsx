import { useNavigate } from 'react-router-dom';
import { useChristmasStore } from '../store/useChristmasStore';
import Card from '../components/Card';

export default function Home() {
  const people = useChristmasStore((state) => state.getPeople());
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen pt-20 pb-12 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      {/* Subtle snowflake pattern background */}
      <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px),
                            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)`,
        }} />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight flex items-center justify-center gap-3 text-gray-800 dark:text-gray-100 mb-3">
            <span className="inline-block text-4xl sm:text-5xl">🎄</span>
            <span>Family Christmas List 2025</span>
            <span className="inline-block text-4xl sm:text-5xl">🎄</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Choose a Family Member
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {people.map((person) => {
            const wishlistCount = person.wishlist.length;
            return (
              <Card
                key={person.id}
                onClick={() => navigate(`/person/${person.id}`)}
                hover={true}
                className="p-6 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {person.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-full bg-gradient-to-r from-red-100 to-green-100 dark:from-red-900/30 dark:to-green-900/30 text-gray-800 dark:text-gray-200 ring-1 ring-red-200/50 dark:ring-red-800/50">
                      <span className="mr-1.5">🎁</span>
                      {wishlistCount}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
