import { Divider } from '../../atoms/Divider';
import { SocialAuthButton } from '../../atoms/SocialAuthButton';

type SocialAuthGroupProps = {
  onGoogle?: () => void;
  onGithub?: () => void;
};

export function SocialAuthGroup({ onGoogle, onGithub }: SocialAuthGroupProps) {
  return (
    <div>
      <Divider>ou entre com outras contas</Divider>
      <div className="flex gap-3">
        <SocialAuthButton provider="google" label="Google" onClick={onGoogle} />
        <SocialAuthButton provider="github" label="GitHub" onClick={onGithub} />
      </div>
    </div>
  );
}
