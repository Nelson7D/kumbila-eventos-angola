
import React, { useState } from 'react';
import { Plus, Trash2, Upload, Check, Image } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ServiceRegister = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [photos, setPhotos] = useState([null, null, null, null]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    shortDescription: '',
    basePrice: '',
    priceUnit: '',
    location: '',
    availability: [],
    contactPhone: '',
    contactEmail: '',
    paymentMethods: [],
  });

  // Service categories
  const categories = [
    'Buffet',
    'Decoração',
    'Entretenimento',
    'Fotografia',
    'Bolos e Doces',
    'Transporte',
    'Segurança',
    'Mobiliário',
    'Outro'
  ];
  
  // Week days
  const weekDays = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
  ];
  
  // Payment methods
  const paymentMethods = [
    'Kamba',
    'TPA',
    'Transferência Bancária',
    'Dinheiro',
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox change for availability
  const handleAvailabilityChange = (day) => {
    const updatedAvailability = [...formData.availability];
    if (updatedAvailability.includes(day)) {
      const index = updatedAvailability.indexOf(day);
      updatedAvailability.splice(index, 1);
    } else {
      updatedAvailability.push(day);
    }
    
    setFormData({
      ...formData,
      availability: updatedAvailability
    });
  };
  
  // Handle checkbox change for payment methods
  const handlePaymentMethodChange = (method) => {
    const updatedMethods = [...formData.paymentMethods];
    if (updatedMethods.includes(method)) {
      const index = updatedMethods.indexOf(method);
      updatedMethods.splice(index, 1);
    } else {
      updatedMethods.push(method);
    }
    
    setFormData({
      ...formData,
      paymentMethods: updatedMethods
    });
  };

  // Handle photo upload
  const handlePhotoChange = (index, file) => {
    const newPhotos = [...photos];
    newPhotos[index] = file;
    setPhotos(newPhotos);
  };

  // Remove photo
  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  // Next step
  const goToNextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Previous step
  const goToPreviousStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    alert('Serviço cadastrado com sucesso!');
    // Redirect or show success message
  };

  return (
    <>
      <Navbar />
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2 text-center">Cadastre seu Serviço</h1>
          <p className="text-center text-white/80">
            Ofereça seus serviços para eventos na plataforma Kumbila
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm mt-1">Informações</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm mt-1">Detalhes</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm mt-1">Fotos</span>
            </div>
          </div>
        </div>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>
              {activeStep === 1 && "Informações Básicas do Serviço"}
              {activeStep === 2 && "Detalhes do Serviço"}
              {activeStep === 3 && "Fotos do Serviço"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Serviço *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Ex: Buffet Santos"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição Curta *
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Resumo do seu serviço (máx 100 caracteres)"
                      maxLength={100}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição Completa *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={5}
                      placeholder="Descreva detalhadamente o seu serviço"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preço Base (Kz) *
                      </label>
                      <input
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Ex: 85000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unidade de Preço *
                      </label>
                      <input
                        type="text"
                        name="priceUnit"
                        value={formData.priceUnit}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Ex: por 100 pessoas"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Localização *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Ex: Luanda Sul, Angola"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="btn-primary"
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Details */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Disponibilidade (Dias da Semana) *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {weekDays.map(day => (
                        <div key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`day-${day}`}
                            checked={formData.availability.includes(day)}
                            onChange={() => handleAvailabilityChange(day)}
                            className="rounded text-primary focus:ring-primary mr-2"
                          />
                          <label htmlFor={`day-${day}`}>{day}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Métodos de Pagamento Aceitos *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {paymentMethods.map(method => (
                        <div key={method} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`payment-${method}`}
                            checked={formData.paymentMethods.includes(method)}
                            onChange={() => handlePaymentMethodChange(method)}
                            className="rounded text-primary focus:ring-primary mr-2"
                          />
                          <label htmlFor={`payment-${method}`}>{method}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone de Contato *
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Ex: +244 923 456 789"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email de Contato
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Ex: seu.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg px-6 py-3 transition-colors duration-200"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="btn-primary"
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Photos */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Fotos do Serviço (mínimo 1, máximo 4)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {photos.map((photo, index) => (
                        <div
                          key={index}
                          className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-40"
                        >
                          {photo ? (
                            <div className="relative w-full h-full">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Foto ${index + 1}`}
                                className="w-full h-full object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                              <Image size={30} className="text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">Adicionar foto</span>
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handlePhotoChange(index, e.target.files[0])}
                                accept="image/*"
                              />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-2"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        Eu concordo com os <a href="#" className="text-primary hover:underline">Termos de Serviço</a> e <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
                      </span>
                    </label>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg px-6 py-3 transition-colors duration-200"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Cadastrar Serviço
                    </button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 max-w-3xl mx-auto text-center text-gray-600">
          <p>Tem dúvidas sobre o cadastro? Entre em contato com nossa equipe de suporte:</p>
          <p className="font-medium mt-2">suporte@kumbila.com | +244 923 000 000</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServiceRegister;
