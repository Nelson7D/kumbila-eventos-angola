
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { reservationService } from "@/services/reservationService";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import OwnerSidebar from "@/components/OwnerSidebar";
import OwnerDashboardMain from "@/components/OwnerDashboardMain";
import { ReservationDetailModal } from "@/components/ReservationDetailModal";
import { isPastEvent } from "@/utils/ownerDashboardUtils";

const OwnerDashboard = () => {
  const [isPremium] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("year");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const spacesData = await reservationService.getOwnerSpaces();
        setSpaces(spacesData);
        const reservationsData = await reservationService.getOwnerReservations();
        setReservations(reservationsData);
        const statsData = await reservationService.getOwnerReservationStats(timeframe);
        setStats(statsData);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seus dados. Tente novamente mais tarde.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [timeframe]);

  const handleConfirmReservation = async () => {
    if (!selectedReservation) return;
    try {
      await reservationService.updateReservationStatus(selectedReservation.id, "confirmada");
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.id === selectedReservation.id ? { ...res, status: "confirmada" } : res
        )
      );
      setDetailModalOpen(false);
      toast({
        title: "Reserva confirmada",
        description: "A reserva foi confirmada com sucesso.",
      });
    } catch {}
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;
    try {
      await reservationService.updateReservationStatus(selectedReservation.id, "cancelada");
      setReservations(prevReservations =>
        prevReservations.map(res =>
          res.id === selectedReservation.id ? { ...res, status: "cancelada" } : res
        )
      );
      setDetailModalOpen(false);
      toast({
        title: "Reserva cancelada",
        description: "A reserva foi cancelada com sucesso.",
      });
    } catch {}
  };

  const handleCheckin = async () => {
    if (!selectedReservation) return;
    try {
      const success = await reservationService.performManualCheckin(selectedReservation.id);
      if (success) {
        setReservations(prevReservations =>
          prevReservations.map(res =>
            res.id === selectedReservation.id ? { ...res, status: "em_andamento" } : res
          )
        );
        setDetailModalOpen(false);
      }
    } catch {}
  };

  const handleCheckout = async () => {
    if (!selectedReservation) return;
    try {
      const success = await reservationService.performManualCheckout(selectedReservation.id);
      if (success) {
        setReservations(prevReservations =>
          prevReservations.map(res =>
            res.id === selectedReservation.id ? { ...res, status: "finalizada" } : res
          )
        );
        setDetailModalOpen(false);
      }
    } catch {}
  };

  const handleViewReservationDetails = (reservation: any) => {
    setSelectedReservation(reservation);
    setDetailModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <OwnerSidebar activeTab={activeTab} setActiveTab={setActiveTab} isPremium={isPremium} />
          <SidebarInset>
            <div className="p-6">
              <OwnerDashboardMain
                activeTab={activeTab}
                loading={loading}
                spaces={spaces}
                reservations={reservations}
                stats={stats}
                setActiveTab={setActiveTab}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                onViewReservationDetails={handleViewReservationDetails}
              />
            </div>
            <footer className="mt-12 p-6 border-t">
              <div className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Kumbila - Painel do Proprietário
              </div>
            </footer>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Footer />
      {selectedReservation && (
        <ReservationDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          reservation={selectedReservation}
          onConfirm={handleConfirmReservation}
          onCancel={handleCancelReservation}
          onCheckin={handleCheckin}
          onCheckout={handleCheckout}
          isPast={isPastEvent(selectedReservation.start_datetime)}
          isOwner={true}
        />
      )}
    </>
  );
};
export default OwnerDashboard;
