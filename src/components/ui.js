"use client";

import { forwardRef } from "react";
import clsx from "clsx";

export const Button = ({ className, variant = "default", size = "md", ...props }) => {
  const base = "inline-flex items-center justify-center rounded-2xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-black text-white hover:bg-black/90",
    outline: "border border-gray-400 text-gray-900 hover:bg-gray-100",
    ghost: "text-gray-900 hover:bg-gray-100",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-5 py-3" };
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
};

export const Card = ({ className, ...props }) => (
  <div className={clsx("rounded-2xl border bg-white shadow-sm", className)} {...props} />
);

export const CardBody = ({ className, ...props }) => (
  <div className={clsx("p-6", className)} {...props} />
);

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input ref={ref} className={clsx("w-full rounded-2xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-black focus:ring-2 focus:ring-black", className)} {...props} />
  );
});

export const Label = ({ className, ...props }) => (
  <label className={clsx("mb-1 block text-sm font-medium text-gray-700", className)} {...props} />
);

export const Badge = ({ className, color = "gray", children }) => {
  const colors = {
    gray: "bg-gray-200 text-gray-900",
    blue: "bg-blue-200 text-blue-900",
    green: "bg-green-200 text-green-900",
    red: "bg-red-200 text-red-900",
    emerald: "bg-emerald-200 text-emerald-900",
  };
  return <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", colors[color], className)}>{children}</span>;
};

export const Table = ({ className, ...props }) => (
  <div className={clsx("overflow-hidden rounded-2xl border", className)}>
    <table className="w-full text-left text-sm">
      {props.children}
    </table>
  </div>
);

export const THead = ({ children }) => (
  <thead className="bg-gray-100 text-gray-800">{children}</thead>
);
export const TBody = ({ children }) => (
  <tbody className="divide-y divide-gray-200">{children}</tbody>
);
export const TR = ({ children, className }) => (
  <tr className={clsx("hover:bg-gray-100/60", className)}>{children}</tr>
);
export const TH = ({ children }) => (
  <th className="px-4 py-3 font-semibold text-gray-900">{children}</th>
);
export const TD = ({ children }) => (
  <td className="px-4 py-3 text-gray-900">{children}</td>
);


