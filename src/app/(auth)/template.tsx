import { PageTransition } from '~/components/motion/pageTransition';

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition variant="auth">{children}</PageTransition>;
}
