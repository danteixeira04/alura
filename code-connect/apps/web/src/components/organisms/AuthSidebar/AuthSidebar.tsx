import { BrandLogo } from '../../atoms/BrandLogo';

type AuthSidebarProps = {
  imageSrc: string;
  imageAlt?: string;
  showBrandLogo?: boolean;
};

export function AuthSidebar({
  imageSrc,
  imageAlt = '',
  showBrandLogo = true,
}: AuthSidebarProps) {
  return (
    <div className="relative hidden w-[46%] md:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(68,255,156,0.18),transparent_55%)]" />
      <img
        src={imageSrc}
        alt={imageAlt}
        aria-hidden={imageAlt ? undefined : true}
        className="h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#021a1d]/90 via-[#021a1d]/30 to-transparent" />

      {showBrandLogo && (
        <div className="absolute inset-x-0 bottom-8 flex justify-center">
          <BrandLogo compact />
        </div>
      )}
    </div>
  );
}
