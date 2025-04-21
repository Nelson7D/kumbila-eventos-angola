
-- Function to get reviews for a space
CREATE OR REPLACE FUNCTION public.get_space_reviews(space_id_param UUID)
RETURNS SETOF public.reviews
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.reviews
  WHERE space_id = space_id_param
  ORDER BY created_at DESC;
$$;

-- Function to create a review
CREATE OR REPLACE FUNCTION public.create_review(
  space_id_param UUID,
  rating_param INTEGER,
  comment_param TEXT
)
RETURNS SETOF public.reviews
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_review reviews;
BEGIN
  -- Insert the new review
  INSERT INTO public.reviews (
    user_id,
    space_id,
    rating,
    comment
  ) VALUES (
    auth.uid(),
    space_id_param,
    rating_param,
    comment_param
  )
  RETURNING * INTO new_review;
  
  -- Return the newly created review
  RETURN QUERY SELECT * FROM public.reviews WHERE id = new_review.id;
END;
$$;
