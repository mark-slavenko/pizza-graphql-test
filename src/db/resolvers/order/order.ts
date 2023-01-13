import prisma from '../../../prisma/prisma';

const queryOrders = async (_parent: any, { filters }: any) => {
  try {

    return [{ id: 1 }];
  } catch (err) {
    return []
  }
}

export default {
  queryOrders
}
