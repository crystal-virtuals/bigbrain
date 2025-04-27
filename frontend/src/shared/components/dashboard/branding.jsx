import { Branding } from '@components/branding';
import { Link } from '@components/link';

export default function DashboardBranding({ className }) {
  return (
    <Link to="/home" aria-label="Home" className={className}>
      <Branding className="px-2" />
    </Link>
  );
}