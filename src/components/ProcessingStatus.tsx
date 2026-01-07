"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Download, AlertCircle } from "lucide-react";

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
      className="mt-8"
    >
      {status === "processing" && (
        <div className="p-8 lg:p-12 bg-[var(--bg-card)] border-2 border-[var(--border)] text-center">
          <motion.div
            className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--accent)] flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-7 h-7 text-[var(--accent)]" />
          </motion.div>

          <h3 className="font-display font-semibold text-xl text-[var(--text-primary)] mb-6">
            Processing...
          </h3>

          <div className="max-w-sm mx-auto">
            <div className="progress-brutal">
              <motion.div
                className="progress-brutal-fill"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="font-mono text-sm text-[var(--text-muted)] mt-3">
              {Math.round(progress)}% complete
            </p>
          </div>
        </div>
      )}

      {status === "done" && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="p-8 lg:p-12 bg-[var(--bg-card)] border-2 border-[var(--accent)] text-center"
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-6 bg-[var(--accent)] flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Check className="w-8 h-8 text-[var(--bg-primary)]" strokeWidth={3} />
          </motion.div>

          <h3 className="font-display font-semibold text-xl text-[var(--text-primary)] mb-2">
            Done!
          </h3>
          <p className="font-mono text-sm text-[var(--text-muted)] mb-8">
            Your file is ready to download
          </p>

          <button onClick={onDownload} className="btn-brutal">
            <Download className="w-4 h-4" />
            {downloadLabel}
          </button>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="p-8 lg:p-12 bg-[var(--bg-card)] border-2 border-[var(--accent-secondary)] text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--accent-secondary)] flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-[var(--accent-secondary)]" />
          </div>

          <h3 className="font-display font-semibold text-xl text-[var(--text-primary)] mb-2">
            Something went wrong
          </h3>
          <p className="font-mono text-sm text-[var(--text-muted)]">
            Please try again or check your files
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
