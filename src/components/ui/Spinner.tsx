interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export default function Spinner({ size = 'md', className = '' }: Props) {
  return (
    <div className={`flex justify-center py-12 ${className}`}>
      <div className={`animate-spin ${sizeMap[size]} border-2 border-brand border-t-transparent rounded-full`} />
    </div>
  );
}
