"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  delay?: number;
}

export default function ToolCard({
  title,
  description,
  icon: Icon,
  href,
  color,
  delay = 0,
}: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link href={href}>
        <motion.div
          className="tool-card glass glass-hover rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer h-full"
          whileHover={{ boxShadow: `0 20px 40px -20px ${color}40` }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="tool-icon w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4"
            style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)` }}
          >
            <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color }} />
          </motion.div>

          <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{title}</h3>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-2">{description}</p>

          <motion.div
            className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm font-medium"
            style={{ color }}
          >
            <span>Use Tool</span>
            <motion.span
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              →
            </motion.span>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
