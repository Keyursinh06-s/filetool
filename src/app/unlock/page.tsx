"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Unlock, Eye, EyeOff, KeyRound } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

export default function UnlockPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUnlock = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setErrorMessage("");

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      // Try to load PDF (with password if provided)
      const loadOptions: { password?: string } = {};
      if (password) {
        loadOptions.password = password;
      }

      const pdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        ...loadOptions,
      });
      setProgress(60);

      // Save without encryption
      const pdfBytes = await pdf.save();
      setProgress(90);

      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultBlob(blob);
      setProgress(100);
      setStatus("done");
    } catch (error) {
      console.error("Error unlocking PDF:", error);
      setErrorMessage("Could not unlock PDF. Please check the password and try again.");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      saveAs(resultBlob, "unlocked.pdf");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setPassword("");
    setResultBlob(null);
    setErrorMessage("");
  };

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove password protection from PDF files"
      icon={Unlock}
      color="#14b8a6"
    >
      {status === "idle" && (
        <>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            maxFiles={1}
            title="Drop your protected PDF here"
            subtitle="Select a password-protected PDF"
          />

          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="glass rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <KeyRound className="w-6 h-6 text-teal-400" />
                  <h3 className="text-white font-medium">Enter PDF Password</h3>
                </div>

                <div>
                  <label className="text-white/60 text-sm block mb-2">
                    Password (if the PDF is encrypted)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter PDF password"
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-teal-500 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-white/40 text-sm mt-2">
                    Leave empty if the PDF only has restriction passwords (print, copy, etc.)
                  </p>
                </div>
              </div>

              <motion.button
                onClick={handleUnlock}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold btn-shine"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Unlock PDF
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      <ProcessingStatus
        status={status}
        progress={progress}
        onDownload={handleDownload}
        downloadLabel="Download Unlocked PDF"
      />

      {status === "error" && errorMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <p className="text-red-300 text-sm">{errorMessage}</p>
        </motion.div>
      )}

      {(status === "done" || status === "error") && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleReset}
          className="mt-4 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
        >
          Unlock another PDF
        </motion.button>
      )}
    </ToolLayout>
  );
}
