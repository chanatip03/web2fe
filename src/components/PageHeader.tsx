import { Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  totalCount?: number;
  countLabel?: string;
}

export const PageHeader = ({
  title,
  totalCount,
  countLabel = "Total",
}: PageHeaderProps) => {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <h4 className="text-primary03 m-0">{title}</h4>
      {totalCount !== undefined && (
        <Typography
          variant="body2"
          sx={{
            color: "var(--color-neutral04)",
            fontSize: 14,
          }}
        >
          {countLabel}: {totalCount}
        </Typography>
      )}
    </div>
  );
};

export default PageHeader;
