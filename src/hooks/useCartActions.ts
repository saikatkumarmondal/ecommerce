import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useAddToCartMutation } from "@/services/cartApi";
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from "@/services/wishlistApi";
import { toggleWishlistItem } from "@/store/slices/wishlistSlice";
import { toast } from "sonner";

export function useCartActions() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const wishlistIds = useAppSelector((s) => s.wishlist.productIds);

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    try {
      await addToCart({ productId, quantity }).unwrap();
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist");
      return;
    }
    const isInWishlist = wishlistIds.includes(productId);
    dispatch(toggleWishlistItem(productId));
    try {
      if (isInWishlist) {
        await removeFromWishlist(productId).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId).unwrap();
        toast.success("Added to wishlist!");
      }
    } catch {
      dispatch(toggleWishlistItem(productId));
      toast.error("Failed to update wishlist");
    }
  };

  return {
    handleAddToCart,
    handleToggleWishlist,
    isAddingToCart,
    wishlistIds,
  };
}