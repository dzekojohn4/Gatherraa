export { Card, CardHeader, CardContent, CardFooter } from '../../../components/ui/molecules/Card/Card';

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}
