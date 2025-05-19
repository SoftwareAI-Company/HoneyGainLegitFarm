
interface LogoProps {
  className?: string;
}

const HoneygainLogo = ({ className = "w-6 h-6" }: LogoProps) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#FFB100"
      />
      <path
        d="M15.9 7.5C15.4029 7.5 15 7.94772 15 8.5C15 9.05228 15.4029 9.5 15.9 9.5C16.3971 9.5 16.8 9.05228 16.8 8.5C16.8 7.94772 16.3971 7.5 15.9 7.5Z"
        fill="#121212"
      />
      <path
        d="M12 6C9.79086 6 8 7.79086 8 10V14C8 16.2091 9.79086 18 12 18C14.2091 18 16 16.2091 16 14V10C16 7.79086 14.2091 6 12 6ZM12 8C13.1046 8 14 8.89543 14 10V14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14V10C10 8.89543 10.8954 8 12 8Z"
        fill="#121212"
      />
    </svg>
  );
};

export default HoneygainLogo;
