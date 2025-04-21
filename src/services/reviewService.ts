
import { supabase } from '@/integrations/supabase/client';
import type { Review } from '@/types/review';
import { toast } from '@/hooks/use-toast';

export const reviewService = {
  async getSpaceReviews(spaceId: string): Promise<Review[]> {
    // Use type assertion to bypass TypeScript typechecking since our RPC function is valid but not in the types
    const { data, error } = await supabase
      .rpc('get_space_reviews', { space_id_param: spaceId }) as unknown as { data: Review[] | null; error: any };

    if (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }

    return data || [];
  },

  async createReview(spaceId: string, rating: number, comment: string): Promise<Review> {
    // Use type assertion to bypass TypeScript typechecking
    const { data, error } = await supabase
      .rpc('create_review', {
        space_id_param: spaceId,
        rating_param: rating,
        comment_param: comment.trim() || null
      }) as unknown as { data: Review[] | null; error: any };

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

    // The create_review function returns the newly created review
    return data![0];
  }
};
