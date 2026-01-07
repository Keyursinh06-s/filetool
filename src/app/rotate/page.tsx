"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, RotateCw } from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

export default function RotatePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(90);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleRotate = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();

      setProgress(30);

      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
      });

      setProgress(70);

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultBlob(blob);
      setProgress(100);
      setStatus("done");
    } catch (error) {
      console.error("Error rotating PDF:", error);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      saveAs(resultBlob, "rotated.pdf");
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
      title="Rotate PDF"
      description="Rotate PDF pages to the correct orientation"
      icon={RotateCcw}
      color="#a78bfa"
    >
      {status === "idle" && (
        <>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            maxFiles={1}
            title="Drop your PDF file here"
            subtitle="Select a PDF to rotate"
          />

          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">Rotation Angle</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[90, 180, 270, -90].map((angle) => (
                    <motion.button
                      key={angle}
                      onClick={() => setRotation(angle)}
                      className={`p-4 rounded-lg border transition-all ${
                        rotation === angle
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {angle > 0 ? (
                        <RotateCw className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                      ) : (
                        <RotateCcw className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                      )}
                      <p className="text-white font-medium">{Math.abs(angle)}°</p>
                      <p className="text-white/50 text-xs">
                        {angle > 0 ? "Clockwise" : "Counter"}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={handleRotate}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold btn-shine"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 40px -10px rgba(167, 139, 250, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                Rotate PDF
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      <ProcessingStatus
        status={status}
        progress={progress}
        onDownload={handleDownload}
        downloadLabel="Download Rotated PDF"
      />

      {status === "done" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleReset}
          className="mt-4 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
        >
          Rotate another PDF
        </motion.button>
      )}
    </ToolLayout>
  );
}