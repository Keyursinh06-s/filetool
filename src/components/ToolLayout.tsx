"use client";

import { motion } from "framer-motion";
import { LucideIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "./Header";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  children: React.ReactNode;
}

export default function ToolLayout({
  title,
  description,
  icon: Icon,
  color,
  children,
}: ToolLayoutProps) {
  return (
    <>
      <Header />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to tools</span>
            </Link>

            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4">
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)` }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color }} />
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white">{title}</h1>
                <p className="text-white/60 text-sm sm:text-base mt-0.5 sm:mt-1">{description}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </>
  );
}
