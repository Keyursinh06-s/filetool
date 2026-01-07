"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Download } from "lucide-react";

interface ProcessingStatusProps {
  status: "idle" | "processing" | "done" | "error";
  progress?: number;
  onDownload?: () => void;
  downloadLabel?: string;
}

export default function ProcessingStatus({
  status,
  progress = 0,
  onDownload,
  downloadLabel = "Download Result",
}: ProcessingStatusProps) {
  if (status === "idle") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-6 sm:mt-8"
    >
      {status === "processing" && (
        <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
          </motion.div>

          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Processing your files...</h3>

          <div className="max-w-xs mx-auto">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-white/50 mt-2 text-xs sm:text-sm">{Math.round(progress)}% complete</p>
          </div>
        </div>
      )}

      {status === "done" && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
        >
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
            </motion.div>
          </motion.div>

          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">All done!</h3>
          <p className="text-white/50 text-sm sm:text-base mb-4 sm:mb-6">Your file is ready to download</p>

          <motion.button
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm sm:text-base font-medium btn-shine"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            {downloadLabel}
          </motion.button>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-red-500/20"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
            <span className="text-3xl sm:text-4xl">😕</span>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Something went wrong</h3>
          <p className="text-white/50 text-sm sm:text-base">Please try again or check your files</p>
        </motion.div>
      )}
    </motion.div>
  );
}
