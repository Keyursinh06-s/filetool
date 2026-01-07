"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileDown, Zap, Scale, Sparkles } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

type CompressionLevel = "low" | "medium" | "high";

export default function CompressPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);

  const compressionOptions = [
    {
      id: "low" as CompressionLevel,
      label: "Low",
      desc: "Better quality, larger file",
      icon: Sparkles,
      color: "#4ade80",
    },
    {
      id: "medium" as CompressionLevel,
      label: "Medium",
      desc: "Balanced compression",
      icon: Scale,
      color: "#facc15",
    },
    {
      id: "high" as CompressionLevel,
      label: "High",
      desc: "Smaller file, lower quality",
      icon: Zap,
      color: "#f43f5e",
    },
  ];

  const handleCompress = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    try {
      const file = files[0];
      const originalSize = file.size;
      const arrayBuffer = await file.arrayBuffer();
      
      setProgress(30);
      
      const pdf = await PDFDocument.load(arrayBuffer);
      
      setProgress(60);
      
      // Note: pdf-lib doesn't have built-in compression
      // In a real app, you'd use a more sophisticated library
      // For demo purposes, we're re-saving the PDF which can slightly reduce size
      const compressedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      
      setProgress(90);
      
      const compressedSize = compressedBytes.length;
      const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      
      setResultBlob(blob);
      setStats({
        original: originalSize,
        compressed: compressedSize,
      });
      setProgress(100);
      setStatus("done");
    } catch (error) {
      console.error("Error compressing PDF:", error);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      saveAs(resultBlob, "compressed.pdf");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultBlob(null);
    setStats(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getReductionPercent = () => {
    if (!stats) return 0;
    return Math.round(((stats.original - stats.compressed) / stats.original) * 100);
  };

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce file size while maintaining quality"
      icon={FileDown}
      color="#4ade80"
    >
      {status === "idle" && (
        <>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            maxFiles={1}
            title="Drop your PDF file here"
            subtitle="Select a PDF to compress"
          />

          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">Compression Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {compressionOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => setCompressionLevel(option.id)}
                        className={`p-4 rounded-lg border transition-all ${
                          compressionLevel === option.id
                            ? "border-green-500 bg-green-500/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon
                          className="w-6 h-6 mb-2"
                          style={{ color: option.color }}
                        />
                        <p className="text-white font-medium">{option.label}</p>
                        <p className="text-white/50 text-sm">{option.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <motion.button
                onClick={handleCompress}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold btn-shine"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 40px -10px rgba(74, 222, 128, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                Compress PDF
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      <ProcessingStatus
        status={status}
        progress={progress}
        onDownload={handleDownload}
        downloadLabel="Download Compressed PDF"
      />

      {status === "done" && stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass rounded-xl p-6"
        >
          <h3 className="text-white font-medium mb-4">Compression Results</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-white/50 text-sm mb-1">Original</p>
              <p className="text-white font-semibold">{formatSize(stats.original)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-sm mb-1">Compressed</p>
              <p className="text-green-400 font-semibold">{formatSize(stats.compressed)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-sm mb-1">Saved</p>
              <motion.p
                className="text-green-400 font-semibold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {getReductionPercent() > 0 ? `${getReductionPercent()}%` : "~"}
              </motion.p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              initial={{ width: "100%" }}
              animate={{ width: `${100 - getReductionPercent()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {status === "done" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleReset}
          className="mt-4 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
        >
          Compress another PDF
        </motion.button>
      )}
    </ToolLayout>
  );
}