import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

const buildPath = (to, params) => {
  if (!params) return to;

  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`$${key}`, encodeURIComponent(value)),
    to,
  );
};

export function ReadButton({ to, params, label = "Read article", className }) {
  return (
    <Link
      to={buildPath(to, params)}
      className={cn(
        "group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full",
        "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700",
        "text-white px-4 xl:px-6 py-2 font-semibold shadow-lg hover:shadow-xl",
        "transition-all duration-300 text-sm xl:text-base",
        "hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 z-0 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 ease-out group-hover/btn:left-[110%] group-hover/btn:opacity-100"
      />

      <span className="relative z-10">{label}</span>

      <span className="relative z-10 grid h-4 w-6 place-items-center overflow-hidden">
        <ArrowRight className="absolute h-4 w-4 transition-all duration-300 ease-out group-hover/btn:translate-x-6 group-hover/btn:opacity-0" />
        <ArrowRight className="absolute h-4 w-4 -translate-x-6 opacity-0 transition-all duration-300 ease-out group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
      </span>
    </Link>
  );
}
