
import { useState } from 'react';
import { Star } from 'lucide-react';
import { reviewService } from '@/services/reviewService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Review form component
 * @param {Object} props - Component props
 * @param {string} props.spaceId - Space ID
 * @param {Function} [props.onReviewSubmitted] - Callback when review is submitted
 */
export function ReviewForm({ spaceId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor, selecione uma nota');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.createReview(spaceId, rating, comment);
      setRating(0);
      setComment('');
      onReviewSubmitted?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avalie sua experiência</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoveredRating(index + 1)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(index + 1)}
              >
                <Star
                  size={24}
                  className={`${
                    index < (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {rating > 0 ? `${rating} estrelas` : 'Selecione uma nota'}
            </span>
          </div>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Compartilhe sua experiência (opcional)"
            maxLength={500}
            className="resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {comment.length}/500 caracteres
            </span>
            <Button type="submit" disabled={rating === 0 || isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar avaliação'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
