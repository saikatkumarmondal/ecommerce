"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/shared/RatingStars";
import { useCreateReviewMutation } from "@/services/reviewApi";
import { useAppSelector } from "@/store/hooks";
import { Product, Review } from "@/types/product.types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const reviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

type ReviewForm = z.infer<typeof reviewSchema>;

interface ReviewSectionProps {
  product: Product & { reviews: Review[] };
}

export function ReviewSection({ product }: ReviewSectionProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>({ resolver: zodResolver(reviewSchema) });

  const onSubmit = async (data: ReviewForm) => {
    if (!selectedRating) {
      toast.error("Please select a rating");
      return;
    }
    try {
      await createReview({
        productId: product.id,
        rating: selectedRating,
        ...data,
      }).unwrap();
      toast.success("Review submitted!");
      reset();
      setSelectedRating(0);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to submit review");
    }
  };

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: product.reviews?.filter((rev) => rev.rating === r).length ?? 0,
  }));

  return (
    <div>
      <h2 className="text-2xl font-black mb-8 flex items-center gap-2">
        <MessageSquare className="w-6 h-6" />
        Customer Reviews
      </h2>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Rating Summary */}
        <div className="bg-muted/30 rounded-2xl p-6 h-fit">
          <div className="text-center mb-6">
            <p className="text-6xl font-black">{product.rating.toFixed(1)}</p>
            <RatingStars
              rating={product.rating}
              totalReviews={product.totalReviews}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Based on {product.totalReviews} reviews
            </p>
          </div>

          {/* Distribution */}
          <div className="space-y-2">
            {ratingCounts.map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-xs w-4 text-right font-medium">
                  {rating}
                </span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        product.totalReviews
                          ? `${(count / product.totalReviews) * 100}%`
                          : "0%",
                    }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-4">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List + Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Write Review */}
          {isAuthenticated && (
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-bold mb-4">Write a Review</h3>

              {/* Star Selector */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Your Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setSelectedRating(star)}
                    >
                      <Star
                        className={cn(
                          "w-7 h-7 transition-colors",
                          star <= (hoveredRating || selectedRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        )}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Review Title</Label>
                  <Input
                    id="title"
                    placeholder="Summary of your experience"
                    {...register("title")}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="comment">Your Review</Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your detailed experience..."
                    rows={4}
                    {...register("comment")}
                    className={errors.comment ? "border-red-500" : ""}
                  />
                  {errors.comment && (
                    <p className="text-xs text-red-500">{errors.comment.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {!product.reviews || product.reviews.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              product.reviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-card border rounded-2xl p-5"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {review.user?.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm">{review.user?.name}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <RatingStars
                        rating={review.rating}
                        size="sm"
                        showCount={false}
                      />
                      <p className="font-semibold text-sm mt-2">{review.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}