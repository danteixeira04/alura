type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/assets/code-connect-logo.svg"
        alt="Code Connect"
        className={compact ? 'h-8 w-auto' : 'h-10 w-auto'}
      />
    </div>
  );
}
