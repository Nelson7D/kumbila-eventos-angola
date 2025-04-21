
import { supabase } from '@/integrations/supabase/client';
import type { Review } from '@/types/review';
import { toast } from '@/hooks/use-toast';

export const reviewService = {
  async getSpaceReviews(spaceId: string): Promise<Review[]> {
    // Typecast supabase as any to call custom RPC functions
    const { data, error } = await ((supabase as any)
      .rpc('get_space_reviews', { space_id_param: spaceId }) as Promise<{ data: Review[] | null; error: any }>);

    if (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }

    return data || [];
  },

  async createReview(spaceId: string, rating: number, comment: string): Promise<Review> {
    const { data, error } = await ((supabase as any)
      .rpc('create_review', {
        space_id_param: spaceId,
        rating_param: rating,
        comment_param: comment.trim() || null
      }) as Promise<{ data: Review[] | null; error: any }>);

    if (error) {
      console.error('Error creating review:', error);
      toast({
        title: "Erro ao criar avaliação",
        description: "Verifique se você já não avaliou este espaço ou se tem uma reserva confirmada.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Avaliação enviada",
      description: "Obrigado por compartilhar sua experiência!",
    });

    return data![0];
  }
};
