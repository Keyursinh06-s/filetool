"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ListOrdered } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

type Position = "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right";
type Format = "1" | "1/n" | "Page 1" | "Page 1 of n";

export default function PageNumbers() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [format, setFormat] = useState<Format>("1");
  const [fontSize, setFontSize] = useState(12);
  const [startFrom, setStartFrom] = useState(1);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleAddPageNumbers = async () => {
    if (files.length === 0) return;
    setStatus("processing");
    setProgress(0);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const totalPages = pages.length;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const pageNum = i + startFrom;

        let text = format === "1" ? `${pageNum}` : format === "1/n" ? `${pageNum}/${totalPages}` : format === "Page 1" ? `Page ${pageNum}` : `Page ${pageNum} of ${totalPages}`;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        
        let x = position.includes("left") ? 30 : position.includes("right") ? width - textWidth - 30 : (width - textWidth) / 2;
        let y = position.includes("top") ? height - 30 : 30;

        page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.3, 0.3, 0.3) });
        setProgress(((i + 1) / totalPages) * 90);
      }

      const pdfBytes = await pdf.save();
      setResultBlob(new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }));
      setProgress(100);
      setStatus("done");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const handleDownload = () => resultBlob && saveAs(resultBlob, "numbered.pdf");
  const handleReset = () => { setFiles([]); setStatus("idle"); setProgress(0); setResultBlob(null); };

  const positions: { id: Position; label: string }[] = [
    { id: "top-left", label: "Top Left" }, { id: "top-center", label: "Top Center" }, { id: "top-right", label: "Top Right" },
    { id: "bottom-left", label: "Bottom Left" }, { id: "bottom-center", label: "Bottom Center" }, { id: "bottom-right", label: "Bottom Right" },
  ];

  return (
    <ToolLayout title="Add Page Numbers" description="Add page numbers to your PDF" icon={ListOrdered} color="#06b6d4">
      {status === "idle" && (
        <>
          <FileUploader files={files} onFilesChange={setFiles} maxFiles={1} title="Drop your PDF here" subtitle="Select a PDF to add page numbers" />
          {files.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Position</h3>
                <div className="grid grid-cols-3 gap-2">
                  {positions.map((pos) => (
                    <motion.button key={pos.id} onClick={() => setPosition(pos.id)} className={`p-3 rounded-lg border text-sm transition-all ${position === pos.id ? "border-cyan-500 bg-cyan-500/10 text-white" : "border-white/10 text-white/60"}`} whileTap={{ scale: 0.98 }}>
                      {pos.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="glass rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Format</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(["1", "1/n", "Page 1", "Page 1 of n"] as Format[]).map((f) => (
                    <motion.button key={f} onClick={() => setFormat(f)} className={`p-4 rounded-lg border ${format === f ? "border-cyan-500 bg-cyan-500/10" : "border-white/10"}`} whileTap={{ scale: 0.98 }}>
                      <p className="text-white">{f}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="glass rounded-xl p-6">
                <label className="text-white/60 text-sm block mb-2">Font Size: {fontSize}px</label>
                <input type="range" min="8" max="24" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-cyan-500" />
              </div>
              <motion.button onClick={handleAddPageNumbers} className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold" whileTap={{ scale: 0.98 }}>
                Add Page Numbers
              </motion.button>
            </motion.div>
          )}
        </>
      )}
      <ProcessingStatus status={status} progress={progress} onDownload={handleDownload} downloadLabel="Download PDF" />
      {status === "done" && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleReset} className="mt-4 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5">Add numbers to another PDF</motion.button>}
    </ToolLayout>
  );
}
