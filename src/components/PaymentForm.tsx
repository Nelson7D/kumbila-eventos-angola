
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { paymentService } from '@/services/paymentService';
import { Tables } from '@/integrations/supabase/types';

interface PaymentFormProps {
  reservationId: string;
  amount: number;
  onPaymentComplete: () => void;
}

const PaymentForm = ({ reservationId, amount, onPaymentComplete }: PaymentFormProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setProofFile(file);
  };

  const handlePaymentSubmit = async () => {
    try {
      setIsProcessing(true);

      // Create payment record
      const payment = await paymentService.createPayment({
        reservation_id: reservationId,
        amount,
        method: selectedMethod
      });

      // Handle different payment methods
      switch (selectedMethod) {
        case 'transferencia_bancaria':
          if (proofFile && payment.id) {
            await paymentService.uploadPaymentProof(payment.id, proofFile);
          }
          break;
        
        case 'multicaixa_express':
          // Simulate payment reference generation
          toast({
            title: "Referência Multicaixa",
            description: `Referência: ${Math.random().toString().slice(2, 11)}`,
          });
          break;
        
        default:
          // Simulate instant payment for other methods
          if (payment.id) {
            await paymentService.simulatePayment(payment.id);
          }
      }

      onPaymentComplete();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'transferencia_bancaria', name: 'Transferência Bancária', description: 'Envie o comprovativo após a transferência' },
    { id: 'multicaixa_express', name: 'Multicaixa Express', description: 'Pague usando uma referência' },
    { id: 'afrimoney', name: 'Afrimoney', description: 'Pague usando sua conta Afrimoney' },
    { id: 'unitelmoney', name: 'Unitel Money', description: 'Pague usando sua conta Unitel Money' },
  ];

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          Total a pagar: {amount.toLocaleString('pt-AO')} Kz
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMethod === method.id ? 'border-primary bg-primary/5' : 'border-gray-200'
            }`}
            onClick={() => handleMethodSelect(method.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              <div className="w-5 h-5 rounded-full border flex items-center justify-center">
                {selectedMethod === method.id && (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMethod === 'transferencia_bancaria' && (
        <div className="space-y-4">
          <Alert>
            <AlertDescription className="space-y-2">
              <p>Dados bancários:</p>
              <p>Banco: BAI</p>
              <p>Conta: 123456789</p>
              <p>IBAN: AO06 0000 0000 0000 0000 0000 0</p>
            </AlertDescription>
          </Alert>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Carregar comprovativo
            </label>
            <Input 
              type="file" 
              accept="image/*,.pdf" 
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      <Button
        className="w-full"
        onClick={handlePaymentSubmit}
        disabled={!selectedMethod || isProcessing}
      >
        {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
      </Button>
    </div>
  );
};

export default PaymentForm;
