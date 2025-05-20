
interface HoneycombIconProps {
  className?: string;
}

const HoneycombIcon = ({ className }: HoneycombIconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 19.5L4.5 15.4605V7.5395L12 3.5L19.5 7.5395V15.4605L12 19.5ZM12 16.731L17.25 13.866V9.134L12 6.269L6.75 9.134V13.866L12 16.731Z" />
    </svg>
  );
};

export default HoneycombIcon;
