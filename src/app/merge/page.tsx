"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { Merge, GripVertical, FileText } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) return;

    setStatus("processing");
    setProgress(0);

    try {
      const mergedPdf = await PDFDocument.create();
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
        setProgress(((i + 1) / totalFiles) * 100);
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultBlob(blob);
      setStatus("done");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      saveAs(resultBlob, "merged.pdf");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultBlob(null);
  };

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document"
      icon={Merge}
      color="#667eea"
    >
      {status === "idle" && (
        <>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            title="Drop your PDF files here"
            subtitle="You can reorder files by dragging"
          />

          {files.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-white/50" />
                  Drag to reorder files
                </h3>
                <Reorder.Group
                  axis="y"
                  values={files}
                  onReorder={setFiles}
                  className="space-y-2"
                >
                  {files.map((file, index) => (
                    <Reorder.Item
                      key={file.name + index}
                      value={file}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <motion.div
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <span className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 text-sm flex items-center justify-center">
                          {index + 1}
                        </span>
                        <FileText className="w-4 h-4 text-white/50" />
                        <span className="text-white/80 truncate flex-1">{file.name}</span>
                        <GripVertical className="w-4 h-4 text-white/30" />
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>

              <motion.button
                onClick={handleMerge}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold btn-shine"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 40px -10px rgba(102, 126, 234, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                Merge {files.length} PDFs
              </motion.button>
            </motion.div>
          )}

          {files.length === 1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/50 mt-6"
            >
              Add at least one more PDF to merge
            </motion.p>
          )}
        </>
      )}

      <ProcessingStatus
        status={status}
        progress={progress}
        onDownload={handleDownload}
        downloadLabel="Download Merged PDF"
      />

      {status === "done" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleReset}
          className="mt-4 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
        >
          Merge more PDFs
        </motion.button>
      )}
    </ToolLayout>
  );
}