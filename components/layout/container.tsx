import React from "react";
import { cn } from "../../lib/utils";



export const Container = ({
  children,
  size = "medium",
  width = "large",
  className = "",
  ...props
}) => {
  const verticalPadding = {
    custom: "",
    small: "py-8",
    medium: "py-12",
    large: "py-24",
    default: "py-12",
  };
  const widthClass = {
    small: "max-w-4xl",
    medium: "max-w-5xl",
    large: "max-w-7xl",
    custom: "",
  };

  return (
    <div
      className={cn(
        widthClass[width],
        `mx-auto px-12 sm:px-32`, // X方向のパディングを大幅に縮小
        verticalPadding[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
