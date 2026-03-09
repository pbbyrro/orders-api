// Transforma dados do formato de entrada para o formato do banco
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

// Transforma dados do banco para o formato de saída
const transformDbToOutput = (dbData) => {
  if (!dbData) return null;

  return {
    orderId: dbData.order_id,
    value: parseFloat(dbData.value),
    creationDate: dbData.creation_date,
    items: dbData.items || [],
  };
};

// Gera próximo ID sequencial mantendo o formato: prefixo + número + sufixo
// Exemplo: v10089001vdb -> v10089002vdb
const generateNextOrderId = (lastOrderId) => {
  if (!lastOrderId) {
    return 'v10089001vdb';
  }

  // Remove sufixo opcional após '-' se existir
  const baseId = lastOrderId.split('-')[0];

  // Extrai partes do ID usando regex
  const match = baseId.match(/^([a-zA-Z]+)(\d+)([a-zA-Z]+)$/);

  if (!match) {
    throw new Error(`Formato de ID inválido: ${lastOrderId}`);
  }

  const [, prefix, numberStr, suffix] = match;
  const number = parseInt(numberStr, 10);

  // Incrementa mantendo zeros à esquerda
  const nextNumber = (number + 1).toString().padStart(numberStr.length, '0');

  return `${prefix}${nextNumber}${suffix}`;
};

export {
  transformInputToDb,
  transformDbToOutput,
  generateNextOrderId,
};
