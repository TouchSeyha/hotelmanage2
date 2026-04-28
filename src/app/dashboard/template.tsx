import { PageTransition } from '~/components/motion/pageTransition';

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition variant="app">{children}</PageTransition>;
}
