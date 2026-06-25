"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Send, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  product: Product & { reviews?: Review[] };
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
      toast.success("Review submitted successfully!");
      reset();
      setSelectedRating(0);
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to submit review");
    }
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: product.reviews?.filter((rev) => rev.rating === r).length ?? 0,
  }));

  return (
    <div className="w-full max-w-7xl mx-auto px-1 py-4">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-10 border-b pb-4 border-muted">
        <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Customer Reviews
          </h2>
          <p className="text-sm text-muted-foreground">
            See what other buyers are saying about this item
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Rating Summary Board */}
        <div className="lg:col-span-4 bg-gradient-to-b from-muted/40 to-muted/10 border rounded-3xl p-6 sm:p-8 shadow-sm backdrop-blur-sm sticky top-24">
          <div className="text-center mb-8">
            <p className="text-7xl font-black tracking-tighter text-foreground mb-2">
              {product.rating.toFixed(1)}
            </p>
            <div className="flex justify-center scale-110 my-3">
              <RatingStars
                rating={product.rating}
                totalReviews={product.totalReviews}
                size="lg"
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-2">
              Based on {product.totalReviews} verified global reviews
            </p>
          </div>

          {/* Rating Bars distribution */}
          <div className="space-y-3.5">
            {ratingCounts.map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-3 group/row cursor-default">
                <span className="text-sm font-bold w-3 text-right text-muted-foreground group-hover/row:text-foreground transition-colors">
                  {rating}
                </span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden shadow-inner relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{
                      width: product.totalReviews
                        ? `${(count / product.totalReviews) * 100}%`
                        : "0%",
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                  />
                </div>
                <span className="text-sm font-semibold text-muted-foreground w-6 text-right group-hover/row:text-foreground transition-colors">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form & Reviews List Stack */}
        <div className="lg:col-span-8 space-y-8 w-full">
          {/* Form Block */}
          {isAuthenticated && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border-2 border-muted/70 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles className="w-24 h-24 text-primary" />
              </div>

              <h3 className="text-xl font-extrabold tracking-tight mb-6 flex items-center gap-2">
                Write a Review
              </h3>

              {/* Star Rating Interactive Input */}
              <div className="bg-muted/30 border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <span className="text-sm font-bold text-foreground">How would you rate this product?</span>
                <div className="flex gap-1.5 bg-background px-3 py-1.5 rounded-xl border shadow-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      type="button"
                      key={star}
                      whileHover={{ scale: 1.25, rotate: 8 }}
                      whileTap={{ scale: 0.85 }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setSelectedRating(star)}
                      className="focus:outline-none p-0.5"
                    >
                      <Star
                        className={cn(
                          "w-7 h-7 transition-all duration-200 drop-shadow-sm",
                          star <= (hoveredRating || selectedRating)
                            ? "fill-amber-400 text-amber-400 scale-105"
                            : "text-muted-foreground/40 hover:text-muted-foreground"
                        )}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-bold text-sm">Review Title</Label>
                  <Input
                    id="title"
                    placeholder="E.g., Outstanding performance, highly recommended!"
                    {...register("title")}
                    className={cn(
                      "h-12 rounded-xl border bg-background px-4 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                      errors.title && "border-destructive focus-visible:ring-destructive/20"
                    )}
                  />
                  {errors.title && (
                    <p className="text-xs font-semibold text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment" className="font-bold text-sm">Your Detailed Feedback</Label>
                  <Textarea
                    id="comment"
                    placeholder="What did you like or dislike? How was the quality?"
                    rows={4}
                    {...register("comment")}
                    className={cn(
                      "rounded-xl border bg-background p-4 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary resize-none",
                      errors.comment && "border-destructive focus-visible:ring-destructive/20"
                    )}
                  />
                  {errors.comment && (
                    <p className="text-xs font-semibold text-destructive">{errors.comment.message}</p>
                  )}
                </div>

                {/* 3D Tactile Submit Button */}
                <div className="relative pt-2 group/btn">
                  {/* Button Shadow Base (Creates the 3D depth ring) */}
                  <div className="absolute inset-x-0 bottom-0 top-4 rounded-xl bg-primary-foreground border-b-4 border-primary/40 dark:border-primary/80 transition-all duration-200 group-hover/btn:translate-y-[2px]" />
                  
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 2 }}
                    className={cn(
                      "relative w-full h-13 rounded-xl bg-primary text-primary-foreground font-black tracking-wide text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-xl border border-primary/20 border-b-4 border-primary-foreground/20 active:border transition-all uppercase",
                      isLoading && "opacity-80 cursor-not-allowed"
                    )}
                  >
                    {/* Glossy overlay sheen */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover/btn:animate-shimmer transition-transform duration-1000" />
                    
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Publishing...
                      </span>
                    ) : (
                      <>
                        Submit Review
                        <Send className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* List Section Container */}
          <div className="space-y-4">
            {!product.reviews || product.reviews.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-muted rounded-3xl text-muted-foreground bg-muted/5">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-bold text-base">No reviews logged yet</p>
                <p className="text-sm text-muted-foreground/80 mt-0.5">Be the first to provide feedback for this asset!</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {product.reviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring" as const, stiffness: 140, damping: 16, delay: idx * 0.05 }}
                    className="bg-card border hover:border-muted-foreground/30 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="w-11 h-11 border-2 border-background shadow-sm ring-1 ring-muted">
                        <AvatarFallback className="bg-primary/5 text-primary text-sm font-black tracking-wider">
                          {review.user?.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <p className="font-bold text-sm text-foreground tracking-tight">{review.user?.name}</p>
                          <span className="text-xs font-medium text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        
                        <div className="mb-2">
                          <RatingStars rating={review.rating} size="sm" showCount={false} />
                        </div>
                        
                        <p className="font-bold text-base text-foreground mt-2 tracking-tight group-hover:text-primary transition-colors duration-200">
                          {review.title}
                        </p>
                        <p className="text-sm text-muted-foreground/90 mt-1.5 leading-relaxed font-normal">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}