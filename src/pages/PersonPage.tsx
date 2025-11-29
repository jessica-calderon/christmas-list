import { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChristmasStore } from '../store/useChristmasStore';
import WishItemCard from '../components/WishItemCard';
import AddWishForm from '../components/AddWishForm';
import Container from '../layout/Container';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import FloatingAddButton from '../components/FloatingAddButton';
import Toast from '../components/Toast';
import type { WishItem } from '../types/wishItem';
import { subscribeToWishlist, addWishlistItem, deleteWishlistItem, updateWishlistItem } from '../services/wishlist';
import { isSanta } from '../config/santa';

export default function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const person = useChristmasStore((state) => state.getPerson(id || ''));
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [santa, setSanta] = useState(isSanta());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToWishlist(id, (items) => {
        setWishlistItems(items);
        setIsLoading(false);
        setError(null);
      });

      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError('Failed to load wishlist. Please refresh the page.');
      setIsLoading(false);
    }
  }, [id]);

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

  if (!person) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <Container>
          <div className="text-center animate-fade-in">
            <Card className="p-4 sm:p-6">
              <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-4">
                Person not found
              </p>
              <GradientButton onClick={() => navigate('/')}>
                Go Home
              </GradientButton>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  const handleAddWishItem = async (item: WishItem) => {
    try {
      await addWishlistItem(person.id, item);
      setToast({ message: 'Wishlist item added successfully! 🎁', type: 'success' });
    } catch (err) {
      console.error('Error adding wishlist item:', err);
      setError('Failed to add wishlist item. Please try again.');
      setToast({ message: 'Failed to add wishlist item. Please try again.', type: 'error' });
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!santa) {
      alert('Only Santa can delete wishlist items.');
      return;
    }
    try {
      await deleteWishlistItem(person.id, itemId);
      setToast({ message: 'Wishlist item deleted successfully! 🗑️', type: 'error' });
    } catch (err) {
      console.error('Error deleting wishlist item:', err);
      setError('Failed to delete wishlist item. Please try again.');
      setToast({ message: 'Failed to delete wishlist item. Please try again.', type: 'error' });
    }
  };

  const handleEdit = async (updatedItem: WishItem) => {
    if (!santa) {
      alert('Only Santa can edit wishlist items.');
      return;
    }
    try {
      const { id: itemId, ...updates } = updatedItem;
      await updateWishlistItem(person.id, itemId, updates);
    } catch (err) {
      console.error('Error updating wishlist item:', err);
      setError('Failed to update wishlist item. Please try again.');
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 3rem)' }}>
      {/* Subtle snowflake pattern background */}
      <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px),
                            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)`,
        }} />
      </div>

      <Container>
        <div className="animate-fade-in">
          {/* Santa Mode Banner */}
          {santa && (
            <Card className="p-3 sm:p-4 mb-4 bg-gradient-to-r from-red-500/20 via-green-500/20 to-red-500/20 dark:from-red-600/30 dark:via-green-600/30 dark:to-red-600/30 border-red-400/50 dark:border-red-500/50 animate-fade-in">
              <p className="text-center text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100">
                🎅 Santa Mode Enabled — All gifts revealed!
              </p>
            </Card>
          )}

          {/* Title Section */}
          <Card className="p-4 sm:p-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                {person.name}'s Christmas Wishlist
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-2xl sm:text-3xl">🎄</span>
              </div>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto my-3"></div>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                <span className="mr-2">🎁</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{wishlistItems.length}</span>
                <span className="ml-1">wishlist {wishlistItems.length === 1 ? 'item' : 'items'}</span>
              </p>
            </div>
          </Card>

          {error && (
            <Card className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </Card>
          )}

          <div ref={formRef}>
            <AddWishForm onAdd={handleAddWishItem} />
          </div>

          <FloatingAddButton onClick={scrollToForm} />

          {isLoading ? (
            <Card className="p-4 sm:p-6 text-center">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Loading wishlist... 🎁
              </p>
            </Card>
          ) : wishlistItems.length === 0 ? (
            <Card className="p-4 sm:p-6 text-center">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                No wish items yet. Add one above! 🎁
              </p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {wishlistItems.map((item) => (
                  <WishItemCard
                    key={item.id}
                    item={item}
                    personId={person.id}
                    onDelete={() => handleDelete(item.id)}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </>
          )}

          {/* Footer message when not in Santa Mode */}
          {!santa && (
            <div className="mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">
                Pssst... No peeking! Santa is the only one who can see hidden gifts.
              </p>
            </div>
          )}
        </div>
      </Container>
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
