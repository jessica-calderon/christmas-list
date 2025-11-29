import { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChristmasStore } from '../store/useChristmasStore';
import WishItemCard from '../components/WishItemCard';
import AddWishForm from '../components/AddWishForm';
import Container from '../layout/Container';
import Card from '../components/Card';
import GradientButton from '../components/GradientButton';
import FloatingAddButton from '../components/FloatingAddButton';
import type { WishItem } from '../types/wishItem';
import { subscribeToWishlist, addWishlistItem, deleteWishlistItem, updateWishlistItem } from '../services/wishlist';
import { isAdmin } from '../config/admin';

export default function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const person = useChristmasStore((state) => state.getPerson(id || ''));
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  if (!person) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <Container>
          <div className="text-center animate-fade-in">
            <Card className="p-8 sm:p-12">
              <p className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 mb-6">
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
    if (!isAdmin()) {
      alert('Only admins can add wishlist items.');
      return;
    }
    try {
      await addWishlistItem(person.id, item);
    } catch (err) {
      console.error('Error adding wishlist item:', err);
      setError('Failed to add wishlist item. Please try again.');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!isAdmin()) {
      alert('Only admins can delete wishlist items.');
      return;
    }
    try {
      await deleteWishlistItem(person.id, itemId);
    } catch (err) {
      console.error('Error deleting wishlist item:', err);
      setError('Failed to delete wishlist item. Please try again.');
    }
  };

  const handleEdit = async (updatedItem: WishItem) => {
    if (!isAdmin()) {
      alert('Only admins can edit wishlist items.');
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
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      {/* Subtle snowflake pattern background */}
      <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px),
                            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)`,
        }} />
      </div>

      <Container>
        <div className="animate-fade-in">
          {/* Title Section */}
          <Card className="p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-3">
                {person.name}'s Christmas Wishlist
              </h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-3xl sm:text-4xl">🎄</span>
              </div>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto mb-4"></div>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                <span className="mr-2">🎁</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{wishlistItems.length}</span>
                <span className="ml-1">wishlist {wishlistItems.length === 1 ? 'item' : 'items'}</span>
              </p>
            </div>
          </Card>

          {error && (
            <Card className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </Card>
          )}

          {isAdmin() && (
            <div ref={formRef}>
              <AddWishForm onAdd={handleAddWishItem} />
            </div>
          )}

          {isAdmin() && <FloatingAddButton onClick={scrollToForm} />}

          {isLoading ? (
            <Card className="p-8 sm:p-12 text-center">
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                Loading wishlist... 🎁
              </p>
            </Card>
          ) : wishlistItems.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center">
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                No wish items yet. {isAdmin() && 'Add one above! 🎁'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {wishlistItems.map((item) => (
                <WishItemCard
                  key={item.id}
                  item={item}
                  onDelete={() => handleDelete(item.id)}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
