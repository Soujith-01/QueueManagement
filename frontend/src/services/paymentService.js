import api from './api';

export const paymentService = {
  createPaymentOrder: async (orderId) => {
    const res = await api.post('/payments/create-order', { orderId });
    return res.data;
  },

  verifyPayment: async (paymentData) => {
    const res = await api.post('/payments/verify', paymentData);
    return res.data;
  },

  // Razorpay Checkout integration helper
  initiateRazorpayCheckout: ({
    paymentData,
    order,
    user,
    onSuccess,
    onFailure,
  }) => {
    // If running in demo mode or Razorpay script is unavailable, simulate seamless checkout
    if (paymentData.isDemoPayment || !window.Razorpay) {
      setTimeout(async () => {
        try {
          const verifyRes = await paymentService.verifyPayment({
            orderId: order.id,
            razorpayOrderId: paymentData.razorpayOrderId,
            razorpayPaymentId: 'pay_demo_' + Math.random().toString(36).substring(2, 11),
            razorpaySignature: 'demo_sig_valid',
          });
          onSuccess(verifyRes);
        } catch (err) {
          onFailure(err);
        }
      }, 900);
      return;
    }

    const options = {
      key: paymentData.keyId,
      amount: Math.round(paymentData.amount * 100),
      currency: paymentData.currency || 'INR',
      name: 'Apex University Canteen',
      description: `Pre-Order Token #${order.tokenNumber}`,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&auto=format&fit=crop&q=80',
      order_id: paymentData.razorpayOrderId,
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: {
        color: '#f97316',
      },
      handler: async (response) => {
        try {
          const verifyRes = await paymentService.verifyPayment({
            orderId: order.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          onSuccess(verifyRes);
        } catch (err) {
          onFailure(err);
        }
      },
      modal: {
        ondismiss: () => {
          onFailure(new Error('Payment checkout was dismissed by user'));
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  },
};
