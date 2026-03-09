// Transforms data from input format to database format
const transformInputToDb = (inputData) => {
  return {
    orderId: inputData.numeroPedido,
    value: inputData.valorTotal,
    creationDate: inputData.dataCriacao || new Date(),
    items: inputData.items?.map(item => ({
      productId: item.idItem,
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })) || [],
  };
};

// Transforms database data to output format
const transformDbToOutput = (dbData) => {
  if (!dbData) return null;

  return {
    orderId: dbData.order_id,
    value: parseFloat(dbData.value),
    creationDate: dbData.creation_date,
    items: dbData.items || [],
  };
};

// Generates next sequential ID maintaining format: prefix + number + suffix
// Example: v10089001vdb -> v10089002vdb
const generateNextOrderId = (lastOrderId) => {
  if (!lastOrderId) {
    return 'v10089001vdb';
  }

  // Remove optional suffix after '-' if it exists
  const baseId = lastOrderId.split('-')[0];

  // Extract ID parts using regex
  const match = baseId.match(/^([a-zA-Z]+)(\d+)([a-zA-Z]+)$/);

  if (!match) {
    throw new Error(`Formato de ID inválido: ${lastOrderId}`);
  }

  const [, prefix, numberStr, suffix] = match;
  const number = parseInt(numberStr, 10);

  // Increment while maintaining leading zeros
  const nextNumber = (number + 1).toString().padStart(numberStr.length, '0');

  return `${prefix}${nextNumber}${suffix}`;
};

export {
  transformInputToDb,
  transformDbToOutput,
  generateNextOrderId,
};
