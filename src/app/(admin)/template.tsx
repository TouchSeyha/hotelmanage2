import { PageTransition } from '~/components/motion/pageTransition';

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition variant="app">{children}</PageTransition>;
}
