import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, X, Trash2 } from 'lucide-react';
import { useChristmasStore } from '../store/useChristmasStore';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import Toast from '../components/Toast';
import SantaDashboard from '../components/SantaDashboard';
import { subscribeToWishlist } from '../services/wishlist';
import { subscribeToPersons, addPerson, deletePerson, getCurrentUserId } from '../services/persons';
import { isSanta } from '../config/santa';
import { initialFamily } from '../data/family';
import type { Person } from '../types/person';

export default function Home() {
  const people = useChristmasStore((state) => state.getPeople());
  const setPeople = useChristmasStore((state) => state.setPeople);
  const deletePersonFromStore = useChristmasStore((state) => state.deletePerson);
  const markInitialFamilyDeleted = useChristmasStore((state) => state.markInitialFamilyDeleted);
  const deletedInitialFamilyIds = useChristmasStore((state) => state.deletedInitialFamilyIds);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [wishlistCounts, setWishlistCounts] = useState<Record<string, number>>({});
  const [santa, setSanta] = useState(isSanta());
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Subscribe to Firebase persons
  useEffect(() => {
    const unsubscribe = subscribeToPersons((firebasePersons) => {
      // Merge Firebase persons with initial family
      // Initial family members don't have createdBy, so we keep them
      const initialFamilyIds = new Set(initialFamily.map(p => p.id));
      const deletedIdsSet = new Set(deletedInitialFamilyIds);
      
      // Convert Firebase persons to Person type (add wishlist: [])
      const firebasePersonsAsPeople: Person[] = firebasePersons.map(p => ({
        ...p,
        wishlist: [],
      }));
      
      // Filter out deleted initial family members
      const activeInitialFamily = initialFamily.filter(p => !deletedIdsSet.has(p.id));
      
      // Combine: keep active initial family, add Firebase persons that aren't in initial family
      const combined: Person[] = [
        ...activeInitialFamily,
        ...firebasePersonsAsPeople.filter(p => !initialFamilyIds.has(p.id))
      ];
      
      setPeople(combined);
      
      // Mark as initialized
      if (!hasInitialized) {
        setHasInitialized(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setPeople, hasInitialized, deletedInitialFamilyIds]);

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

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonName.trim() && !isAdding) {
      setIsAdding(true);
      try {
        await addPerson(newPersonName.trim());
        setNewPersonName('');
        setShowAddForm(false);
        setToast({ message: 'Person added successfully! 🎄', type: 'success' });
      } catch (error: any) {
        console.error('Error adding person:', error);
        const errorMessage = error?.message || error?.code || 'Unknown error';
        const fullError = `Failed to add person: ${errorMessage}`;
        console.error('Full error details:', error);
        setToast({ message: fullError, type: 'error' });
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleDeletePerson = async (e: React.MouseEvent, personId: string, person: Person) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    
    // Check permissions
    const currentUserId = getCurrentUserId();
    const isCreator = person.createdBy === currentUserId;
    const canDelete = santa || isCreator;
    
    if (!canDelete) {
      alert('You can only delete people you created. Santa can delete anyone.');
      return;
    }
    
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete ${person.name}?`)) {
      return;
    }
    
    setIsDeleting(personId);
    try {
      if (person.createdBy) {
        // Firebase person - delete from Firebase
        await deletePerson(personId);
      } else {
        // Initial family member - delete from local store and mark as deleted
        deletePersonFromStore(personId);
        markInitialFamilyDeleted(personId);
      }
      setToast({ message: `${person.name} deleted successfully! 🗑️`, type: 'error' });
    } catch (error) {
      console.error('Error deleting person:', error);
      setToast({ message: 'Failed to delete person. Please try again.', type: 'error' });
    } finally {
      setIsDeleting(null);
    }
  };

  const canDeletePerson = (person: Person): boolean => {
    // Santa can delete anyone (Firebase persons and initial family members)
    if (santa) return true;
    
    // Regular users can only delete Firebase persons they created
    if (!person.createdBy) return false; // Can't delete initial family members (unless Santa)
    return person.createdBy === getCurrentUserId(); // Can delete if you created it
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

        {/* Santa Dashboard */}
        <SantaDashboard people={people} />

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
                  <GradientButton 
                    type="submit" 
                    className="flex-1 flex items-center justify-center gap-2"
                    disabled={isAdding}
                  >
                    <Plus className="w-5 h-5" />
                    {isAdding ? 'Adding...' : 'Add Person'}
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
            const showDeleteButton = canDeletePerson(person);
            const isDeletingThis = isDeleting === person.id;
            
            return (
              <Card
                key={person.id}
                onClick={() => !isDeletingThis && navigate(`/person/${person.id}`)}
                hover={!isDeletingThis}
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
                    {showDeleteButton && (
                      <button
                        onClick={(e) => handleDeletePerson(e, person.id, person)}
                        disabled={isDeletingThis}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={santa ? "Santa: Delete person" : "Delete person you created"}
                      >
                        <Trash2 className={`w-5 h-5 text-red-600 dark:text-red-400 ${isDeletingThis ? 'animate-pulse' : ''}`} />
                      </button>
                    )}
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
