const ORDERS_KEY = "shoptech_orders";

export const orderService = {
  getAllOrders: () => {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  },

  getUserOrders: (userId) => {
    const orders = orderService.getAllOrders();
    return orders.filter((o) => o.userId === Number(userId));
  },

  createOrder: (orderData) => {
    const orders = orderService.getAllOrders();
    const newOrder = {
      ...orderData,
      id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1001, // Start order IDs at 1001
      status: "Pending",
      date: new Date().toISOString(),
    };

    orders.unshift(newOrder); // Add to beginning so recent orders show first
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Optional: Decrement stock of products
    try {
      const products = JSON.parse(localStorage.getItem("shoptech_products")) || [];
      newOrder.items.forEach((item) => {
        const prodIndex = products.findIndex((p) => p.id === item.id);
        if (prodIndex !== -1) {
          products[prodIndex].stock = Math.max(0, (products[prodIndex].stock || 10) - item.quantity);
        }
      });
      localStorage.setItem("shoptech_products", JSON.stringify(products));
    } catch (e) {
      console.error("Failed to update stock", e);
    }

    return newOrder;
  },

  updateOrderStatus: (orderId, status) => {
    const orders = orderService.getAllOrders();
    const index = orders.findIndex((o) => o.id === Number(orderId));
    if (index === -1) return null;

    orders[index].status = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return orders[index];
  }
};
