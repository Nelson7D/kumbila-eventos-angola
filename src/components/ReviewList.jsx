
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { reviewService } from '@/services/reviewService';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Review list component
 * @param {Object} props - Component props
 * @param {string} props.spaceId - Space ID
 */
export function ReviewList({ spaceId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await reviewService.getSpaceReviews(spaceId);
        setReviews(data);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [spaceId]);

  if (loading) {
    return <div className="animate-pulse">Carregando avaliações...</div>;
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Este espaço ainda não possui avaliações.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className={index < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {review.comment && (
              <p className="text-gray-700">{review.comment}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
