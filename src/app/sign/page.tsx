"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FileSignature, Eraser, Download, Pen } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

export default function SignPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureSize, setSignatureSize] = useState(150);
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 10 });
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(3);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = penColor;
    context.lineWidth = penSize;
    contextRef.current = context;
  }, [penColor, penSize]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);

    // Save signature data
    if (canvasRef.current) {
      setSignatureData(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const handleSign = async () => {
    if (files.length === 0 || !signatureData) return;

    setStatus("processing");
    setProgress(0);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      const pdf = await PDFDocument.load(arrayBuffer);
      setProgress(40);

      // Embed signature image
      const signatureImage = await pdf.embedPng(signatureData);
      setProgress(60);

      // Add signature to all pages or just the last page
      const pages = pdf.getPages();
      const lastPage = pages[pages.length - 1];
      const { width, height } = lastPage.getSize();

      // Calculate position (percentage-based)
      const sigWidth = signatureSize;
      const sigHeight = (signatureImage.height / signatureImage.width) * sigWidth;
      const x = (signaturePosition.x / 100) * (width - sigWidth);
      const y = (signaturePosition.y / 100) * (height - sigHeight);

      lastPage.drawImage(signatureImage, {
        x,
        y,
        width: sigWidth,
        height: sigHeight,
      });

      setProgress(80);

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultBlob(blob);
      setProgress(100);
      setStatus("done");
    } catch (error) {
      console.error("Error signing PDF:", error);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      saveAs(resultBlob, "signed.pdf");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultBlob(null);
    clearSignature();
  };

  return (
    <ToolLayout
      title="Sign PDF"
      description="Add your signature to PDF documents"
      icon={FileSignature}
      color="#8b5cf6"
    >
      {status === "idle" && (
        <>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            maxFiles={1}
            title="Drop your PDF file here"
            subtitle="Select a PDF to sign"
          />

          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              {/* Signature Pad */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Pen className="w-5 h-5 text-violet-400" />
                    <h3 className="text-white font-medium">Draw Your Signature</h3>
                  </div>
                  <motion.button
                    onClick={clearSignature}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eraser className="w-4 h-4" />
                    Clear
                  </motion.button>
                </div>

                <div className="bg-white rounded-xl overflow-hidden touch-none">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-48 cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>

                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <label className="text-white/60 text-sm block mb-2">Pen Color</label>
                    <div className="flex gap-2">
                      {["#000000", "#0000ff", "#ff0000"].map((c) => (
                        <button
                          key={c}
                          onClick={() => setPenColor(c)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            penColor === c ? "border-white scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-white/60 text-sm block mb-2">Pen Size: {penSize}px</label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={penSize}
                      onChange={(e) => setPenSize(parseInt(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>
                </div>
              </div>

              {/* Signature Settings */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Signature Settings</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/60 text-sm block mb-2">
                      Size: {signatureSize}px
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={signatureSize}
                      onChange={(e) => setSignatureSize(parseInt(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm block mb-2">
                      Horizontal: {signaturePosition.x}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={signaturePosition.x}
                      onChange={(e) =>
                        setSignaturePosition({ ...signaturePosition, x: parseInt(e.target.value) })
                      }
                      className="w-full accent-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm block mb-2">
                      Vertical: {signaturePosition.y}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={signaturePosition.y}
                      onChange={(e) =>
                        setSignaturePosition({ ...signaturePosition, y: parseInt(e.target.value) })
                      }
                      className="w-full accent-violet-500"
                    />
                  </div>
                </div>

                <p className="text-white/40 text-sm mt-4">
                  Signature will be added to the last page of your document
                </p>
              </div>

              <motion.button
                onClick={handleSign}
                disabled={!signatureData}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold btn-shine disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={signatureData ? { scale: 1.02 } : {}}
                whileTap={signatureData ? { scale: 0.98 } : {}}
              >
                {signatureData ? "Sign PDF" : "Draw your signature first"}
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      <ProcessingStatus
        status={status}
        progress={progress}
        onDownload={handleDownload}
        downloadLabel="Download Signed PDF"
      />

      {status === "done" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleReset}
          className="mt-4 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
        >
          Sign another PDF
        </motion.button>
      )}
    </ToolLayout>
  );
}
