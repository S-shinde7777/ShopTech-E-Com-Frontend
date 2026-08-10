import { apiFetch } from './api';

export const orderService = {
  getAllOrders: async () => {
    const data = await apiFetch('/orders');
    return data.orders.map(o => ({ ...o, id: o._id }));
  },

  getUserOrders: async (userId) => {
    const data = await apiFetch('/orders/my');
    return data.orders.map(o => ({ ...o, id: o._id }));
  },

  createOrder: async (orderData) => {
    const data = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return { ...data.order, id: data.order._id };
  },

  updateOrderStatus: async (orderId, status) => {
    const data = await apiFetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return { ...data.order, id: data.order._id };
  },
};
