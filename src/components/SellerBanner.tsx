interface SellerBannerProps {
  sellerName: string;
  action: string;
}

export default function SellerBanner({ sellerName, action }: SellerBannerProps) {
  return (
    <div className="bg-brand-light border border-brand/20 rounded-xl px-4 py-3 mb-4">
      <p className="text-sm text-brand">
        {action}:{' '}
        <span className="font-semibold">{sellerName}</span>
      </p>
    </div>
  );
}
