import * as orderModel from '../models/orderModel.js';
import {
  transformInputToDb,
  transformDbToOutput,
  generateNextOrderId,
} from '../utils/dataTransform.js';
import {
  successResponse,
  errorResponse,
} from '../utils/response.js';

const createOrder = async (req, res, next) => {
  try {
    if (!req.body.numeroPedido || !req.body.valorTotal) {
      return errorResponse(
        res,
        'numeroPedido e valorTotal são obrigatórios',
        400
      );
    }

    const transformedData = transformInputToDb(req.body);

    const lastOrderId = await orderModel.getLastOrderId();
    const newOrderId = generateNextOrderId(lastOrderId);

    const orderData = {
      ...transformedData,
      orderId: newOrderId,
    };

    const createdOrder = await orderModel.createOrder(orderData);
    const response = transformDbToOutput(createdOrder);

    return successResponse(
      res,
      response,
      'Pedido criado com sucesso',
      201
    );
  } catch (error) {
    next(error);
  }
};

const getOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    if (!orderNumber) {
      return errorResponse(
        res,
        'Número do pedido é obrigatório',
        400
      );
    }

    const order = await orderModel.getOrderById(orderNumber);

    if (!order) {
      return errorResponse(res, 'Pedido não encontrado', 404);
    }

    const response = transformDbToOutput(order);
    return successResponse(res, response, 'Pedido encontrado');
  } catch (error) {
    next(error);
  }
};

const listOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getAllOrders();
    const response = orders.map((order) =>
      transformDbToOutput(order)
    );

    return successResponse(
      res,
      response,
      'Pedidos listados com sucesso'
    );
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    if (!orderNumber) {
      return errorResponse(
        res,
        'Número do pedido é obrigatório',
        400
      );
    }

    if (!req.body.valorTotal) {
      return errorResponse(res, 'valorTotal é obrigatório', 400);
    }

    const transformedData = transformInputToDb(req.body);

    const updatedOrder = await orderModel.updateOrder(
      orderNumber,
      transformedData
    );

    if (!updatedOrder) {
      return errorResponse(res, 'Pedido não encontrado', 404);
    }

    const response = transformDbToOutput(updatedOrder);
    return successResponse(
      res,
      response,
      'Pedido atualizado com sucesso'
    );
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    if (!orderNumber) {
      return errorResponse(
        res,
        'Número do pedido é obrigatório',
        400
      );
    }

    const deleted = await orderModel.deleteOrder(orderNumber);

    if (!deleted) {
      return errorResponse(res, 'Pedido não encontrado', 404);
    }

    return successResponse(
      res,
      { orderId: orderNumber },
      'Pedido deletado com sucesso'
    );
  } catch (error) {
    next(error);
  }
};

export {
  createOrder,
  getOrderByNumber,
  listOrders,
  updateOrder,
  deleteOrder,
};
