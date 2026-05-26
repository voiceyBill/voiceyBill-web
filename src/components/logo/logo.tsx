import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link } from "react-router-dom";

const Logo = (props: { url?: string; compact?: boolean }) => {
  return (
    <Link
      to={props.url || PROTECTED_ROUTES.OVERVIEW}
      className="flex items-center gap-2.5"
    >
      <img
        src="/logo.png"
        alt="VoiceyBill"
        className="h-8 w-8 flex-shrink-0 rounded-lg object-cover"
      />
      {!props.compact && (
        <span className="font-semibold text-[17px] tracking-tight">
          VoiceyBill
        </span>
      )}
    </Link>
  );
};

export default Logo;
