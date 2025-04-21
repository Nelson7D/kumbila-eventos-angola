
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { reservationService } from '@/services/reservationService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpaceGallery from '@/components/SpaceGallery';
import { getSpaceById } from '@/utils/sampleData';
import SpaceDetailHeader from '@/components/SpaceDetailHeader';
import SpaceDetailInfo from '@/components/SpaceDetailInfo';
import SpaceBookingSidebar from '@/components/SpaceBookingSidebar';
import { ReviewList } from '@/components/ReviewList';
import { ReviewForm } from '@/components/ReviewForm';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const SpaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userHasConfirmedReservation, setUserHasConfirmedReservation] = useState(false);

  useEffect(() => {
    if (id) {
      const spaceData = getSpaceById(id);
      if (spaceData) {
        setSpace(spaceData);
      }
      setLoading(false);
      loadConfirmedReservations();
    }
  }, [id]);

  const loadConfirmedReservations = async () => {
    try {
      const reservations = await reservationService.getSpaceReservations(id!);
      const dates = reservations.map((res: any) => new Date(res.start_datetime));
      setBookedDates(dates);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  useEffect(() => {
    const checkUserReservation = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !id) return;

      try {
        const { data: reservations } = await supabase
          .from('reservations')
          .select()
          .eq('user_id', user.id)
          .eq('space_id', id)
          .eq('status', 'confirmada')
          .limit(1);

        setUserHasConfirmedReservation(!!reservations?.length);
      } catch (error) {
        console.error('Error checking user reservation:', error);
      }
    };

    checkUserReservation();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Carregando...</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!space) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Espaço não encontrado</h1>
            <p className="text-gray-600 mb-8">
              O espaço que você está procurando não está disponível.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <SpaceDetailHeader 
            name={space.name}
            location={space.location}
            capacity={space.capacity}
            rating={space.rating}
            type={space.type}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SpaceGallery images={space.images} name={space.name} />
              <SpaceDetailInfo
                description={space.description}
                amenities={space.amenities}
                extras={space.extras}
              />
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Avaliações</h2>
                {userHasConfirmedReservation && !showReviewForm && (
                  <div className="mb-4">
                    <Button 
                      onClick={() => setShowReviewForm(true)}
                      variant="outline"
                    >
                      Deixar uma avaliação
                    </Button>
                  </div>
                )}
                
                {showReviewForm && (
                  <div className="mb-6">
                    <ReviewForm 
                      spaceId={id!} 
                      onReviewSubmitted={() => {
                        setShowReviewForm(false);
                      }}
                    />
                  </div>
                )}
                
                <ReviewList spaceId={id!} />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <SpaceBookingSidebar
                spaceId={id!}
                price={space.price}
                bookedDates={bookedDates}
                onReservationComplete={loadConfirmedReservations}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SpaceDetail;
