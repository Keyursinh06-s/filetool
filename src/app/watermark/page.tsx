"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Stamp, Type, Image as ImageIcon } from "lucide-react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

type WatermarkType = "text" | "image";
type Position = "center" | "diagonal" | "top" | "bottom";

export default function WatermarkPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>("text");
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(30);
  const [rotation, setRotation] = useState(45);
  const [position, setPosition] = useState<Position>("diagonal");
  const [color, setColor] = useState("#ff0000");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleWatermark = async () => {
    if (files.length === 0 || !text.trim()) return;

    setStatus("processing");
    setProgress(0);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);

      setProgress(40);

      // Parse color
      const r = parseInt(color.slice(1, 3), 16) / 255;
      const g = parseInt(color.slice(3, 5), 16) / 255;
      const b = parseInt(color.slice(5, 7), 16) / 255;

      const totalPages = pages.length;
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x = (width - textWidth) / 2;
        let y = height / 2;
        let rotate = 0;

        switch (position) {
          case "center":
            rotate = 0;
            break;
          case "diagonal":
            rotate = rotation;
            x = width / 4;
            y = height / 2;
            break;
          case "top":
            rotate = 0;
            y = height - 60;
            break;
          case "bottom":
            rotate = 0;
            y = 40;
            break;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity: opacity / 100,
          rotate: degrees(rotate),
        });

        setProgress(40 + ((i + 1) / totalPages) * 50);
      }

      const pdfBytes = await pdf.save();
      setProgress(95);

      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultBlob(blob);
      setProgress(100);
      setStatus("done");
    } catch (error) {
      console.error("Error adding watermark:", error);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      saveAs(resultBlob, "watermarked.pdf");
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
      title="Watermark PDF"
      description="Add text or image watermarks to your documents"
      icon={Stamp}
      color="#eab308"
    >
      {status === "idle" && (
        <>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            maxFiles={1}
            title="Drop your PDF file here"
            subtitle="Select a PDF to watermark"
          />

          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              {/* Watermark Type */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Watermark Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "text" as WatermarkType, label: "Text", icon: Type },
                    { id: "image" as WatermarkType, label: "Image", icon: ImageIcon, disabled: true },
                  ].map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => !type.disabled && setWatermarkType(type.id)}
                      disabled={type.disabled}
                      className={`p-4 rounded-lg border transition-all flex items-center gap-3 ${
                        watermarkType === type.id
                          ? "border-yellow-500 bg-yellow-500/10"
                          : "border-white/10 hover:border-white/30"
                      } ${type.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      whileHover={!type.disabled ? { scale: 1.02 } : {}}
                      whileTap={!type.disabled ? { scale: 0.98 } : {}}
                    >
                      <type.icon className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">{type.label}</span>
                      {type.disabled && (
                        <span className="text-xs text-white/40 ml-auto">Soon</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Text Settings */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Watermark Text</h3>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter watermark text"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-yellow-500 outline-none transition-colors"
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-white/60 text-sm block mb-2">
                      Font Size: {fontSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full accent-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm block mb-2">
                      Opacity: {opacity}%
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(parseInt(e.target.value))}
                      className="w-full accent-yellow-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-white/60 text-sm block mb-2">Color</label>
                  <div className="flex gap-2">
                    {["#ff0000", "#0000ff", "#000000", "#888888", "#eab308"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          color === c ? "border-white scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Position */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Position</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "diagonal" as Position, label: "Diagonal" },
                    { id: "center" as Position, label: "Center" },
                    { id: "top" as Position, label: "Top" },
                    { id: "bottom" as Position, label: "Bottom" },
                  ].map((pos) => (
                    <motion.button
                      key={pos.id}
                      onClick={() => setPosition(pos.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        position === pos.id
                          ? "border-yellow-500 bg-yellow-500/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-white text-sm">{pos.label}</span>
                    </motion.button>
                  ))}
                </div>

                {position === "diagonal" && (
                  <div className="mt-4">
                    <label className="text-white/60 text-sm block mb-2">
                      Rotation: {rotation}°
                    </label>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="w-full accent-yellow-500"
                    />
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Preview</h3>
                <div className="aspect-[4/3] bg-white/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="w-32 h-40 bg-white/10 rounded shadow-lg" />
                  <span
                    className="absolute font-bold"
                    style={{
                      fontSize: `${fontSize / 4}px`,
                      color: color,
                      opacity: opacity / 100,
                      transform: `rotate(-${position === "diagonal" ? rotation : 0}deg)`,
                    }}
                  >
                    {text}
                  </span>
                </div>
              </div>

              <motion.button
                onClick={handleWatermark}
                disabled={!text.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold btn-shine disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Watermark
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      <ProcessingStatus
        status={status}
        progress={progress}
        onDownload={handleDownload}
        downloadLabel="Download Watermarked PDF"
      />

      {status === "done" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleReset}
          className="mt-4 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
        >
          Watermark another PDF
        </motion.button>
      )}
    </ToolLayout>
  );
}
