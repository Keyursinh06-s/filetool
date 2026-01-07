"use client";

import { motion } from "framer-motion";
import { LucideIcon, Sparkles } from "lucide-react";
import ToolLayout from "./ToolLayout";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export default function ComingSoon({ title, description, icon, color }: ComingSoonProps) {
  return (
    <ToolLayout title={title} description={description} icon={icon} color={color}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-12 text-center"
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-12 h-12 text-indigo-400" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-3">Coming Soon</h2>
        <p className="text-white/60 max-w-md mx-auto mb-8">
          We&apos;re working hard to bring you this feature. Stay tuned for updates!
        </p>

        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </ToolLayout>
  );
}
