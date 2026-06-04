import { cn } from "@/lib/utils";
import PageHeader from "./page-header";

interface PropsType {
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  showHeader?: boolean;
  addMarginTop?: boolean;
  renderPageHeader?: React.ReactNode;
}

const PageLayout = ({ children, className, headerClassName,
  title,
  subtitle,
  rightAction,
  showHeader = true,
  addMarginTop = false,
  renderPageHeader,
 }: PropsType) => {
  return (
    <div>
      {showHeader && (
        <PageHeader
          title={title}
          subtitle={subtitle}
          rightAction={rightAction}
          renderPageHeader={renderPageHeader}
          className={headerClassName}
        />
      )}
    <div className={cn("w-full max-w-[var(--max-width)] mx-auto px-4 sm:px-6 pt-8",
      addMarginTop && "-mt-20",
      className)}>
      {children}
    </div>
    </div>
  );
};

export default PageLayout;
