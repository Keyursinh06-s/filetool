"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PenTool, Type, Square, Circle, Minus } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

interface Annotation {
  id: string;
  type: "text" | "rectangle" | "circle" | "line";
  x: number;
  y: number;
  content?: string;
  width?: number;
  height?: number;
  color: string;
  page: number;
}

export default function EditPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentTool, setCurrentTool] = useState<"text" | "rectangle" | "circle" | "line">("text");
  const [textContent, setTextContent] = useState("Your text here");
  const [color, setColor] = useState("#ff0000");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const addAnnotation = () => {
    const newAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      type: currentTool,
      x: 100,
      y: 700,
      content: currentTool === "text" ? textContent : undefined,
      width: currentTool !== "text" ? 100 : undefined,
      height: currentTool !== "text" && currentTool !== "line" ? 50 : undefined,
      color,
      page: 1,
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  };

  const handleEdit = async () => {
    if (files.length === 0) return;
    setStatus("processing");
    setProgress(0);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();

      setProgress(30);

      for (const ann of annotations) {
        if (ann.page > pages.length) continue;
        const page = pages[ann.page - 1];
        
        const r = parseInt(ann.color.slice(1, 3), 16) / 255;
        const g = parseInt(ann.color.slice(3, 5), 16) / 255;
        const b = parseInt(ann.color.slice(5, 7), 16) / 255;

        switch (ann.type) {
          case "text":
            page.drawText(ann.content || "", {
              x: ann.x,
              y: ann.y,
              size: 14,
              font,
              color: rgb(r, g, b),
            });
            break;
          case "rectangle":
            page.drawRectangle({
              x: ann.x,
              y: ann.y,
              width: ann.width || 100,
              height: ann.height || 50,
              borderColor: rgb(r, g, b),
              borderWidth: 2,
            });
            break;
          case "circle":
            page.drawEllipse({
              x: ann.x + (ann.width || 100) / 2,
              y: ann.y + (ann.height || 50) / 2,
              xScale: (ann.width || 100) / 2,
              yScale: (ann.height || 50) / 2,
              borderColor: rgb(r, g, b),
              borderWidth: 2,
            });
            break;
          case "line":
            page.drawLine({
              start: { x: ann.x, y: ann.y },
              end: { x: ann.x + (ann.width || 100), y: ann.y },
              color: rgb(r, g, b),
              thickness: 2,
            });
            break;
        }
      }

      setProgress(70);
      const pdfBytes = await pdf.save();
      setResultBlob(new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }));
      setProgress(100);
      setStatus("done");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const handleDownload = () => resultBlob && saveAs(resultBlob, "edited.pdf");
  const handleReset = () => { setFiles([]); setStatus("idle"); setAnnotations([]); setResultBlob(null); };

  const tools = [
    { id: "text" as const, icon: Type, label: "Text" },
    { id: "rectangle" as const, icon: Square, label: "Rectangle" },
    { id: "circle" as const, icon: Circle, label: "Circle" },
    { id: "line" as const, icon: Minus, label: "Line" },
  ];

  return (
    <ToolLayout title="Edit PDF" description="Add text, shapes and annotations" icon={PenTool} color="#ec4899">
      {status === "idle" && (
        <>
          <FileUploader files={files} onFilesChange={setFiles} maxFiles={1} title="Drop your PDF here" subtitle="Select a PDF to edit" />
          
          {files.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Select Tool</h3>
                <div className="grid grid-cols-4 gap-2">
                  {tools.map((tool) => (
                    <motion.button key={tool.id} onClick={() => setCurrentTool(tool.id)} className={`p-4 rounded-lg border flex flex-col items-center gap-2 ${currentTool === tool.id ? "border-pink-500 bg-pink-500/10" : "border-white/10"}`} whileTap={{ scale: 0.98 }}>
                      <tool.icon className="w-5 h-5 text-pink-400" />
                      <span className="text-white text-xs">{tool.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {currentTool === "text" && (
                <div className="glass rounded-xl p-6">
                  <label className="text-white/60 text-sm block mb-2">Text Content</label>
                  <input type="text" value={textContent} onChange={(e) => setTextContent(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" placeholder="Enter text" />
                </div>
              )}

              <div className="glass rounded-xl p-6">
                <label className="text-white/60 text-sm block mb-2">Color</label>
                <div className="flex gap-2">
                  {["#ff0000", "#0000ff", "#00ff00", "#000000", "#ff9900"].map((c) => (
                    <button key={c} onClick={() => setColor(c)} className={`w-10 h-10 rounded-lg border-2 ${color === c ? "border-white" : "border-transparent"}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              <motion.button onClick={addAnnotation} className="w-full py-3 rounded-xl border border-pink-500/50 text-pink-400 hover:bg-pink-500/10" whileTap={{ scale: 0.98 }}>
                + Add {currentTool}
              </motion.button>

              {annotations.length > 0 && (
                <div className="glass rounded-xl p-6">
                  <h3 className="text-white font-medium mb-4">Added Annotations ({annotations.length})</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {annotations.map((ann) => (
                      <div key={ann.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: ann.color }} />
                          <span className="text-white capitalize">{ann.type}</span>
                          {ann.content && <span className="text-white/50 text-sm truncate max-w-32">{ann.content}</span>}
                        </div>
                        <button onClick={() => removeAnnotation(ann.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <motion.button onClick={handleEdit} disabled={annotations.length === 0} className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold disabled:opacity-50" whileTap={{ scale: 0.98 }}>
                {annotations.length === 0 ? "Add annotations first" : `Apply ${annotations.length} Annotations`}
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      <ProcessingStatus status={status} progress={progress} onDownload={handleDownload} downloadLabel="Download Edited PDF" />
      {status === "done" && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleReset} className="mt-4 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5">Edit another PDF</motion.button>}
    </ToolLayout>
  );
}
