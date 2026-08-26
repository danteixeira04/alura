type AuthSwitchLinkProps = {
  message: string;
  actionLabel: string;
  onClick: () => void;
};

export function AuthSwitchLink({ message, actionLabel, onClick }: AuthSwitchLinkProps) {
  return (
    <div className="mt-8 text-center text-sm text-[#c7d1d2]">
      {message}{' '}
      <button
        type="button"
        onClick={onClick}
        className="font-semibold text-[#7df5ab] hover:text-[#9fffba]"
      >
        {actionLabel}
      </button>
    </div>
  );
}
