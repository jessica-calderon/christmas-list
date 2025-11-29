import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, X } from 'lucide-react';
import { useChristmasStore } from '../store/useChristmasStore';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import { subscribeToWishlist } from '../services/wishlist';

export default function Home() {
  const people = useChristmasStore((state) => state.getPeople());
  const addPerson = useChristmasStore((state) => state.addPerson);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [wishlistCounts, setWishlistCounts] = useState<Record<string, number>>({});

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

        {/* Search and Add Person Section */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a person..."
                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-800/40 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200"
              />
            </div>
          </Card>

          {/* Add Person Form */}
          {showAddForm ? (
            <Card className="p-6">
              <form onSubmit={handleAddPerson} className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
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
                  <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    placeholder="Enter person's name"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/40 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 text-slate-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200"
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
                    className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Card>
          ) : (
            <GradientButton
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Person
            </GradientButton>
          )}
        </div>

        <div className="space-y-4 sm:space-y-5">
          {filteredPeople.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
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
            })
          )}
        </div>
      </div>
    </div>
  );
}
