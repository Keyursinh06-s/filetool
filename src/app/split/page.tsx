"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Split, FileText, Download } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

export default function SplitPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState<"all" | "range" | "extract">("all");
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
  const [resultBlobs, setResultBlobs] = useState<{ name: string; blob: Blob }[]>([]);

  const handleFilesChange = async (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      const arrayBuffer = await newFiles[0].arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const count = pdf.getPageCount();
      setPageCount(count);
      setRangeEnd(count);
    } else {
      setPageCount(0);
    }
  };

  const handleSplit = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const results: { name: string; blob: Blob }[] = [];

      if (splitMode === "all") {
        const total = pdf.getPageCount();
        for (let i = 0; i < total; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(pdf, [i]);
          newPdf.addPage(page);
          const bytes = await newPdf.save();
          const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
          results.push({ name: `page-${i + 1}.pdf`, blob });
          setProgress(((i + 1) / total) * 100);
        }
      } else if (splitMode === "range") {
        const newPdf = await PDFDocument.create();
        const indices = [];
        for (let i = rangeStart - 1; i < rangeEnd; i++) {
          indices.push(i);
        }
        const pages = await newPdf.copyPages(pdf, indices);
        pages.forEach((page) => newPdf.addPage(page));
        const bytes = await newPdf.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
        results.push({ name: `pages-${rangeStart}-${rangeEnd}.pdf`, blob });
        setProgress(100);
      } else if (splitMode === "extract") {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [rangeStart - 1]);
        newPdf.addPage(page);
        const bytes = await newPdf.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
        results.push({ name: `page-${rangeStart}.pdf`, blob });
        setProgress(100);
      }

      setResultBlobs(results);
      setStatus("done");
    } catch (error) {
      console.error("Error splitting PDF:", error);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    resultBlobs.forEach(({ name, blob }) => {
      saveAs(blob, name);
    });
  };

  const handleDownloadSingle = (name: string, blob: Blob) => {
    saveAs(blob, name);
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setPageCount(0);
    setResultBlobs([]);
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract pages or split your PDF into multiple files"
      icon={Split}
      color="#f093fb"
    >
      {status === "idle" && (
        <>
          <FileUploader
            files={files}
            onFilesChange={handleFilesChange}
            maxFiles={1}
            title="Drop your PDF file here"
            subtitle="Select a single PDF to split"
          />

          {files.length > 0 && pageCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="glass rounded-xl p-6 mb-6">
                <p className="text-white/60 mb-4">
                  Your PDF has <span className="text-white font-semibold">{pageCount}</span> pages
                </p>

                <h3 className="text-white font-medium mb-4">Split Mode</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: "all", label: "Split All", desc: "One file per page" },
                    { id: "range", label: "Range", desc: "Extract page range" },
                    { id: "extract", label: "Extract", desc: "Single page" },
                  ].map((mode) => (
                    <motion.button
                      key={mode.id}
                      onClick={() => setSplitMode(mode.id as typeof splitMode)}
                      className={`p-4 rounded-lg border transition-all ${
                        splitMode === mode.id
                          ? "border-pink-500 bg-pink-500/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p className="text-white font-medium">{mode.label}</p>
                      <p className="text-white/50 text-sm">{mode.desc}</p>
                    </motion.button>
                  ))}
                </div>

                {(splitMode === "range" || splitMode === "extract") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 flex gap-4"
                  >
                    <div className="flex-1">
                      <label className="text-white/60 text-sm block mb-2">
                        {splitMode === "extract" ? "Page number" : "From page"}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={pageCount}
                        value={rangeStart}
                        onChange={(e) => setRangeStart(Math.min(Math.max(1, parseInt(e.target.value) || 1), pageCount))}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-pink-500 outline-none transition-colors"
                      />
                    </div>
                    {splitMode === "range" && (
                      <div className="flex-1">
                        <label className="text-white/60 text-sm block mb-2">To page</label>
                        <input
                          type="number"
                          min={rangeStart}
                          max={pageCount}
                          value={rangeEnd}
                          onChange={(e) => setRangeEnd(Math.min(Math.max(rangeStart, parseInt(e.target.value) || 1), pageCount))}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-pink-500 outline-none transition-colors"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <motion.button
                onClick={handleSplit}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold btn-shine"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 40px -10px rgba(240, 147, 251, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                Split PDF
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      <ProcessingStatus
        status={status}
        progress={progress}
        onDownload={handleDownload}
        downloadLabel={`Download ${resultBlobs.length} ${resultBlobs.length === 1 ? "File" : "Files"}`}
      />

      {status === "done" && resultBlobs.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass rounded-xl p-6"
        >
          <h3 className="text-white font-medium mb-4">Individual Downloads</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {resultBlobs.map(({ name, blob }, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-pink-400" />
                  <span className="text-white/80">{name}</span>
                </div>
                <motion.button
                  onClick={() => handleDownloadSingle(name, blob)}
                  className="p-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Download className="w-4 h-4 text-pink-400" />
                </motion.button>
              </motion.div>
            ))}
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
          Split another PDF
        </motion.button>
      )}
    </ToolLayout>
  );
}