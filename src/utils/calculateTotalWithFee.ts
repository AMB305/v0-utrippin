/**
 * Calculates the total price with a markup fee.
 * @param baseAmount - the original flight price as a number
 * @param markupPercent - your platform fee percentage (default 12%)
 * @returns an object with breakdown and formatted strings
 */
export function calculateTotalWithFee(
  baseAmount: number,
  markupPercent: number = 12
) {
  const fee = +(baseAmount * (markupPercent / 100)).toFixed(2);
  const total = +(baseAmount + fee).toFixed(2);

  return {
    baseAmount,
    fee,
    total,
    breakdown: {
      flightPrice: `$${baseAmount.toFixed(2)}`,
      ourFee: `$${fee.toFixed(2)}`,
      total: `$${total.toFixed(2)}`
    }
  };
}
