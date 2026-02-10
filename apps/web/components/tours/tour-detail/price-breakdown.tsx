interface PriceBreakdownProps {
  breakdown: {
    adults: { count: number; unitPrice: number; total: number };
    children: { count: number; unitPrice: number; total: number };
    subtotal: number;
    taxes: number;
    total: number;
  };
}

export function PriceBreakdown({ breakdown }: PriceBreakdownProps) {
  return (
    <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
        Price Breakdown
      </h3>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>
            Adults ({breakdown.adults.count} × $
            {breakdown.adults.unitPrice.toFixed(2)})
          </span>
          <span>${breakdown.adults.total.toFixed(2)}</span>
        </div>

        {breakdown.children.count > 0 && (
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>
              Children ({breakdown.children.count} × $
              {breakdown.children.unitPrice.toFixed(2)})
            </span>
            <span>${breakdown.children.total.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>${breakdown.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Taxes & fees (10%)</span>
          <span>${breakdown.taxes.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>Total</span>
          <span>${breakdown.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
