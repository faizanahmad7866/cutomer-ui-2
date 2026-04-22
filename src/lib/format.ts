export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const advanceOf = (total: number) => Math.round(total * 0.05);
export const pendingOf = (total: number) => total - advanceOf(total);

// On cancellation 3% of total is kept as gateway charge, 2% refunded (of the 5% paid)
export const refundOnCancel = (total: number) => {
  const paid = advanceOf(total);
  const charge = Math.round(total * 0.03);
  return Math.max(0, paid - charge);
};

export const generateBookingId = () => {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BMH-${rand}`;
};

export const maskName = (name: string) => {
  if (!name) return "User";
  const parts = name.trim().split(" ");
  return parts.map((p) => p[0] + (p.length > 1 ? "*".repeat(Math.min(p.length - 1, 4)) : "")).join(" ");
};