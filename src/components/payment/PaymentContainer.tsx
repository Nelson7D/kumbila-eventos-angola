
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PaymentContainerProps {
  children: React.ReactNode;
}

const PaymentContainer = ({ children }: PaymentContainerProps) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PaymentContainer;
