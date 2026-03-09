import { query, getClient } from '../config/database.js';

const getLastOrderId = async () => {
  const queryText = `
    SELECT order_id
    FROM orders
    ORDER BY creation_date DESC
    LIMIT 1
  `;

  const result = await query(queryText);
  return result.rows[0]?.order_id ?? null;
};

const createOrder = async (orderData) => {
  const client = await getClient();

  try {
    // Start transaction to ensure data integrity
    await client.query('BEGIN');

    const orderQuery = `
      INSERT INTO orders (order_id, value, creation_date)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const orderResult = await client.query(orderQuery, [
      orderData.orderId,
      orderData.value,
      orderData.creationDate,
    ]);

    const order = orderResult.rows[0];

    const items = [];
    if (orderData.items?.length > 0) {
      const itemQuery = `
        INSERT INTO items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      for (const item of orderData.items) {
        const itemResult = await client.query(itemQuery, [
          orderData.orderId,
          item.productId,
          item.quantity,
          item.price,
        ]);
        items.push(itemResult.rows[0]);
      }
    }

    await client.query('COMMIT');

    return { ...order, items };
  } catch (error) {
    // Rollback changes in case of error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getOrderById = async (orderId) => {
  const orderQuery = 'SELECT * FROM orders WHERE order_id = $1';
  const orderResult = await query(orderQuery, [orderId]);

  if (orderResult.rows.length === 0) {
    return null;
  }

  const order = orderResult.rows[0];

  const itemsQuery = 'SELECT * FROM items WHERE order_id = $1';
  const itemsResult = await query(itemsQuery, [orderId]);

  return {
    ...order,
    items: itemsResult.rows.map(item => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: parseFloat(item.price),
    })),
  };
};

const getAllOrders = async () => {
  const ordersQuery = `
    SELECT order_id, value, creation_date
    FROM orders
    ORDER BY creation_date DESC
  `;

  const ordersResult = await query(ordersQuery);
  const orders = [];

  for (const order of ordersResult.rows) {
    const itemsQuery = 'SELECT * FROM items WHERE order_id = $1';
    const itemsResult = await query(itemsQuery, [order.order_id]);

    orders.push({
      order_id: order.order_id,
      value: order.value,
      creation_date: order.creation_date,
      items: itemsResult.rows.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: parseFloat(item.price),
      })),
    });
  }

  return orders;
};

const updateOrder = async (orderId, orderData) => {
  const client = await getClient();

  try {
    // Start transaction for update
    await client.query('BEGIN');

    const orderQuery = `
      UPDATE orders
      SET value = $1, creation_date = $2
      WHERE order_id = $3
      RETURNING *
    `;
    const orderResult = await client.query(orderQuery, [
      orderData.value,
      orderData.creationDate,
      orderId,
    ]);

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const order = orderResult.rows[0];

    // Remove old items before inserting new ones
    await client.query('DELETE FROM items WHERE order_id = $1', [orderId]);

    const items = [];
    if (orderData.items?.length > 0) {
      const itemQuery = `
        INSERT INTO items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      for (const item of orderData.items) {
        const itemResult = await client.query(itemQuery, [
          orderId,
          item.productId,
          item.quantity,
          item.price,
        ]);
        items.push(itemResult.rows[0]);
      }
    }

    await client.query('COMMIT');

    return { ...order, items };
  } catch (error) {
    // Rollback changes in case of error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deleteOrder = async (orderId) => {
  const queryText = 'DELETE FROM orders WHERE order_id = $1';
  const result = await query(queryText, [orderId]);

  return result.rowCount > 0;
};

export {
  getLastOrderId,
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
