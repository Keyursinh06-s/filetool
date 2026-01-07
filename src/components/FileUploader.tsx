"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Image as ImageIcon } from "lucide-react";

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  files: File[];
  title?: string;
  subtitle?: string;
}

export default function FileUploader({
  onFilesChange,
  accept = { "application/pdf": [".pdf"] },
  maxFiles = 20,
  files,
  title = "Drop your files here",
  subtitle = "or click to browse",
}: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      onFilesChange(newFiles);
    },
    [files, maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon;
    return FileText;
  };

  const rootProps = getRootProps();

  return (
    <div className="w-full">
      <div
        {...rootProps}
        className={`upload-zone-brutal p-8 lg:p-12 text-center cursor-pointer transition-all ${
          isDragActive ? "drag-active border-[var(--accent)]" : ""
        }`}
      >
        <input {...getInputProps()} />

        <motion.div
          className="flex flex-col items-center"
          animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-2 border-[var(--border)] flex items-center justify-center mb-6"
            style={{
              boxShadow: isDragActive ? "4px 4px 0px var(--accent)" : "4px 4px 0px var(--border)",
            }}
            animate={isDragActive ? { rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Upload className={`w-7 h-7 ${isDragActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
          </motion.div>

          <h3 className="font-display font-semibold text-xl text-[var(--text-primary)] mb-2">
            {title}
          </h3>
          <p className="font-mono text-sm text-[var(--text-muted)] mb-6">
            {subtitle}
          </p>

          <div className="btn-brutal">
            Select Files
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file);
              return (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-[var(--bg-card)] border-2 border-[var(--border)]"
                >
                  <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                    <FileIcon className="w-5 h-5 text-[var(--accent)]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-[var(--text-primary)] truncate">
                      {file.name}
                    </p>
                    <p className="font-mono text-xs text-[var(--text-muted)]">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="w-8 h-8 flex items-center justify-center border border-[var(--border)] hover:border-[var(--accent-secondary)] hover:text-[var(--accent-secondary)] transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
