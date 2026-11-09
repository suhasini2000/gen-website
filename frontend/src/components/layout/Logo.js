import { Link } from "react-router-dom";
import { useSiteContent } from "@/context/SiteContent";

export function Logo({ light = false, testId = "brand-home" }) {
  const { content } = useSiteContent();
  const logo = content.branding?.logo_url || "/logo.png";
  return (
    <Link to="/" className={light ? "brand light" : "brand"} data-testid={testId}>
      <img className="brand-logo" src={logo} alt="GenInfotech logo" data-testid={`${testId}-logo`} />
      <span><strong>Gen<em>Infotech</em></strong><small>AI Based Software Training</small></span>
    </Link>
  );
}
