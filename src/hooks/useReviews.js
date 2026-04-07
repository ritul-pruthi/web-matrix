import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setReviews(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const addReview = async (userId, rating, comment) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{ user_id: userId, rating, comment }])
        .select();

      if (error) throw error;
      
      // Refresh reviews after adding
      await fetchReviews();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  return { reviews, loading, error, fetchReviews, addReview };
}
