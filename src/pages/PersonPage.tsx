import { useParams, useNavigate } from 'react-router-dom';
import { useChristmasStore } from '../store/useChristmasStore';
import WishItemCard from '../components/WishItemCard';
import AddWishForm from '../components/AddWishForm';
import Container from '../layout/Container';
import type { WishItem } from '../types/wishItem';

export default function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const person = useChristmasStore((state) => state.getPerson(id || ''));
  const addWishItem = useChristmasStore((state) => state.addWishItem);
  const deleteWishItem = useChristmasStore((state) => state.deleteWishItem);
  const editWishItem = useChristmasStore((state) => state.editWishItem);

  if (!person) {
    return (
      <Container>
        <div className="pt-20 text-center">
          <p className="text-white text-xl">Person not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Go Home
          </button>
        </div>
      </Container>
    );
  }

  const handleAddWishItem = (item: WishItem) => {
    addWishItem(person.id, item);
  };

  const handleDelete = (itemId: string) => {
    deleteWishItem(person.id, itemId);
  };

  const handleEdit = (updatedItem: WishItem) => {
    editWishItem(person.id, updatedItem);
  };

  return (
    <Container>
      <div className="pt-20">
        <div className="bg-white rounded-xl p-6 mb-6 border-2 border-red-500 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {person.name}'s Christmas Wishlist 🎄
          </h1>
          <p className="text-gray-600">
            🎁 <span className="font-semibold">{person.wishlist.length}</span> wishlist items
          </p>
        </div>

        <AddWishForm onAdd={handleAddWishItem} />

        {person.wishlist.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border-2 border-red-300">
            <p className="text-gray-500 text-lg">No wish items yet. Add one above! 🎁</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {person.wishlist.map((item) => (
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
  );
}
