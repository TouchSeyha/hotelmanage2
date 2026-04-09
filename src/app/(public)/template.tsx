import { PageTransition } from '~/components/motion/pageTransition';

export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition variant="public">{children}</PageTransition>;
}
