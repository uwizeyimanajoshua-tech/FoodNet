export type MoMoProvider = "MTN" | "Airtel";

export interface PaymentRequest {
  orderId: string;
  phoneNumber: string;
  amount: number;
  provider: MoMoProvider;
  userId: string;
}

/**
 * Payment Service for Rwanda Mobile Money
 * Note: This integrates with the platform's backend for secure processing.
 * Default processing number for Joshua Uwizeyimana: 0796542323
 */
export const MoMoService = {
  async initiatePayment(request: PaymentRequest) {
    try {
      // Connect to secure backend API
      const response = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Payment initiation failed");
      }

      const data = await response.json();
      return {
        success: true,
        transactionId: data.transactionId,
        message: data.message
      };
    } catch (error) {
      console.error("Payment Initiation Error:", error);
      throw error;
    }
  },

  async verifyPayment(transactionId: string) {
    const maxAttempts = 20;
    const intervalMs = 2000;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(`/api/payments/verify/${transactionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === "SUCCESSFUL") {
            return { status: "SUCCESSFUL" };
          } else if (data.status === "FAILED") {
            throw new Error("Payment failed or was cancelled on device.");
          }
        }
      } catch (err) {
        console.error(`Verification poll attempt #${i + 1} failed:`, err);
      }
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    throw new Error("Payment verification timed out. Please check your mobile wallet prompt.");
  }
};
