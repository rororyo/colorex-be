export interface IMidtrans {
  createTransaction(orderId: string, userId: string, amount: number): Promise<{
    token: string,
    redirect_url: string
  }>;
}