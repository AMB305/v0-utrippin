import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ExpediaButtonProps {
  destinationUrl: string; // without camref
  label: string;
  newTab?: boolean;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export const ExpediaButton: React.FC<ExpediaButtonProps> = ({
  destinationUrl,
  label,
  newTab = true,
  variant = "default",
  size = "default",
  className = "",
}) => {
  const camrefCode = "1101l5dQSW";

  const url = new URL(destinationUrl);
  url.searchParams.set("camref", camrefCode);

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
    >
      <a
        href={url.toString()}
        target={newTab ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2"
      >
        {label}
        {newTab && <ExternalLink className="h-4 w-4" />}
      </a>
    </Button>
  );
};