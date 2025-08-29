"use client";

import { SessionProvider } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}


