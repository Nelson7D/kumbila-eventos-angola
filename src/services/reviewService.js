
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const reviewService = {
  /**
   * Gets reviews for a specific space
   * @param {string} spaceId - ID of the space
   * @returns {Promise<Array>}
   */
  async getSpaceReviews(spaceId) {
    // Typecast supabase as any to call custom RPC functions
    const { data, error } = await supabase
      .rpc('get_space_reviews', { space_id_param: spaceId });

    if (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Creates a new review
   * @param {string} spaceId - ID of the space
   * @param {number} rating - Rating value (1-5)
   * @param {string} comment - Review comment
   * @returns {Promise<Object>}
   */
  async createReview(spaceId, rating, comment) {
    const { data, error } = await supabase
      .rpc('create_review', {
        space_id_param: spaceId,
        rating_param: rating,
        comment_param: comment.trim() || null
      });

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

    return data[0];
  }
};
