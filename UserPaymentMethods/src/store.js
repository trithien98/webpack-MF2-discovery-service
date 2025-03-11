import { makeAutoObservable } from 'mobx';

export class PaymentStore {
  paymentMethods = [
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2024',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '5555',
      expiryMonth: '03',
      expiryYear: '2025',
      isDefault: false,
    },
    {
      id: 3,
      type: 'American Express',
      last4: '0005',
      expiryMonth: '08',
      expiryYear: '2026',
      isDefault: false,
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  setDefaultPaymentMethod(id) {
    this.paymentMethods = this.paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    }));
  }
}