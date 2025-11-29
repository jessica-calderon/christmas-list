import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, X } from 'lucide-react';
import { useChristmasStore } from '../store/useChristmasStore';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import { subscribeToWishlist } from '../services/wishlist';
import { isSanta } from '../config/santa';

export default function Home() {
  const people = useChristmasStore((state) => state.getPeople());
  const addPerson = useChristmasStore((state) => state.addPerson);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [wishlistCounts, setWishlistCounts] = useState<Record<string, number>>({});
  const [santa, setSanta] = useState(isSanta());

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    people.forEach((person) => {
      try {
        const unsubscribe = subscribeToWishlist(person.id, (items) => {
          setWishlistCounts((prev) => ({
            ...prev,
            [person.id]: items.length,
          }));
        });
        unsubscribes.push(unsubscribe);
      } catch (error) {
        console.error(`Error subscribing to wishlist for ${person.id}:`, error);
      }
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [people]);

  useEffect(() => {
    const updateSantaStatus = () => {
      setSanta(isSanta());
    };

    updateSantaStatus();

    // Listen for Santa status changes (from login/logout)
    window.addEventListener('santaStatusChanged', updateSantaStatus);
    
    // Listen for storage changes (from other tabs)
    window.addEventListener('storage', updateSantaStatus);
    
    // Check periodically as fallback
    const interval = setInterval(updateSantaStatus, 1000);

    return () => {
      window.removeEventListener('santaStatusChanged', updateSantaStatus);
      window.removeEventListener('storage', updateSantaStatus);
      clearInterval(interval);
    };
  }, []);

  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonName.trim()) {
      addPerson(newPersonName.trim());
      setNewPersonName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-20 pb-12 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 3rem)' }}>
      {/* Subtle snowflake pattern background */}
      <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px),
                            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)`,
        }} />
      </div>

      <div className="relative px-4 sm:px-6 max-w-xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-3 text-gray-800 dark:text-gray-100">
            <span className="inline-block text-2xl sm:text-3xl md:text-4xl">🎄</span>
            <span>Family Christmas List 2025</span>
            <span className="inline-block text-2xl sm:text-3xl md:text-4xl">🎄</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-2">
            Choose a Family Member
          </p>
        </div>

        {/* Search and Add Person Section */}
        <div className="space-y-4">
          {/* Search Bar */}
          <Card className="p-4 sm:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a person..."
                className="w-full pl-10 pr-3 mt-1 p-3 rounded-xl bg-gray-800 text-sm text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-200"
              />
            </div>
          </Card>

          {/* Add Person Form */}
          {showAddForm ? (
            <Card className="p-4 sm:p-6">
              <form onSubmit={handleAddPerson} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">
                    Add New Person
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewPersonName('');
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    placeholder="Enter person's name"
                    className="w-full mt-1 p-3 rounded-xl bg-gray-800 text-sm text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-200"
                    required
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <GradientButton type="submit" className="flex-1 flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Person
                  </GradientButton>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewPersonName('');
                    }}
                    className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 text-base sm:text-lg font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Card>
          ) : (
            <GradientButton
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Person
            </GradientButton>
          )}
        </div>

        <div className="space-y-3">
          {filteredPeople.length === 0 ? (
            <Card className="p-4 sm:p-6 text-center">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                {searchQuery ? 'No people found matching your search.' : 'No people in the list yet.'}
              </p>
            </Card>
          ) : (
            filteredPeople.map((person) => {
            const wishlistCount = wishlistCounts[person.id] ?? 0;
            return (
              <Card
                key={person.id}
                onClick={() => navigate(`/person/${person.id}`)}
                hover={true}
                className="p-4 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
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
            })
          )}
        </div>

        {/* Footer message when not in Santa Mode */}
        {!santa && (
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">
              Pssst... No peeking! Santa is the only one who can see hidden gifts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
