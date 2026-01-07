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
  title = "Drop your PDF files here",
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
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
        className={`upload-zone rounded-2xl p-6 sm:p-12 text-center cursor-pointer ${
          isDragActive ? "drag-active" : ""
        }`}
      >
        <input {...getInputProps()} />

        <motion.div
          className="flex flex-col items-center"
          animate={isDragActive ? { y: -10 } : { y: 0 }}
        >
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 sm:mb-6"
            animate={isDragActive ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
          </motion.div>

          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-white/50 text-sm sm:text-base">{subtitle}</p>

          <motion.div
            className="mt-4 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm sm:text-base font-medium"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(102, 126, 234, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Select Files
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 sm:mt-6 space-y-2 sm:space-y-3"
          >
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file);
              return (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="file-item glass rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <FileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate text-sm sm:text-base">{file.name}</p>
                    <p className="text-white/50 text-xs sm:text-sm">{formatFileSize(file.size)}</p>
                  </div>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-colors flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 hover:text-red-400" />
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


