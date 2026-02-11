type ButtonGoToProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  content?: string;
};

export const ButtonGoTo = ({
  content,
  children,
  onClick,
  disabled = false,
  className = "",
}: ButtonGoToProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {content || children}
    </button>
  );
};