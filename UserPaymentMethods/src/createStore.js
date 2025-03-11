import { createStore as createVanilla } from 'zustand';

const createStore = () => createVanilla((set) => ({
  paymentMethods: [
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2025',
      isDefault: true
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '5678',
      expiryMonth: '08',
      expiryYear: '2024',
      isDefault: false
    }
  ],
  setDefaultMethod: (selectedId) => set((state) => ({
    paymentMethods: state.paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === selectedId
    }))
  }))
}));

export default createStore; 