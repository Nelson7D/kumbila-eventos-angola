
import { supabase } from '@/integrations/supabase/client';
import type { Review } from '@/types/review';
import { toast } from '@/hooks/use-toast';

export const reviewService = {
  async getSpaceReviews(spaceId: string): Promise<Review[]> {
    // Use raw SQL query to avoid TypeScript errors with the reviews table
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('space_id', spaceId)
      .order('created_at', { ascending: false }) as { data: Review[] | null; error: any };

    if (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }

    return data || [];
  },

  async createReview(spaceId: string, rating: number, comment: string): Promise<Review> {
    // Use raw SQL query to avoid TypeScript errors with the reviews table
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        space_id: spaceId,
        rating,
        comment: comment.trim() || null
      })
      .select() as { data: Review[] | null; error: any };

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
