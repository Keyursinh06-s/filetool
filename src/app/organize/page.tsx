"use client";

import { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { Layers, Trash2, RotateCw, GripVertical } from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

interface PageInfo {
  id: string;
  pageNum: number;
  rotation: number;
  deleted: boolean;
  thumbnail?: string;
}

export default function OrganizePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (files.length === 0) return;
    loadPdfPages();
  }, [files]);

  const loadPdfPages = async () => {
    setLoading(true);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();
      
      const pageInfos: PageInfo[] = [];
      for (let i = 0; i < pageCount; i++) {
        pageInfos.push({
          id: `page-${i}`,
          pageNum: i + 1,
          rotation: 0,
          deleted: false,
        });
      }
      setPages(pageInfos);
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
    setLoading(false);
  };

  const rotatePage = (id: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const deletePage = (id: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, deleted: !p.deleted } : p));
  };

  const handleOrganize = async () => {
    if (files.length === 0) return;
    setStatus("processing");
    setProgress(0);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const activePages = pages.filter(p => !p.deleted);
      
      for (let i = 0; i < activePages.length; i++) {
        const pageInfo = activePages[i];
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageInfo.pageNum - 1]);
        
        if (pageInfo.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees(currentRotation + pageInfo.rotation));
        }
        
        newPdf.addPage(copiedPage);
        setProgress(((i + 1) / activePages.length) * 90);
      }

      const pdfBytes = await newPdf.save();
      setResultBlob(new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }));
      setProgress(100);
      setStatus("done");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const handleDownload = () => resultBlob && saveAs(resultBlob, "organized.pdf");
  
  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setPages([]);
    setResultBlob(null);
  };

  const activePages = pages.filter(p => !p.deleted);
  const deletedCount = pages.filter(p => p.deleted).length;

  return (
    <ToolLayout title="Organize PDF" description="Delete, reorder & rotate pages" icon={Layers} color="#ec4899">
      {status === "idle" && (
        <>
          <FileUploader files={files} onFilesChange={setFiles} maxFiles={1} title="Drop your PDF here" subtitle="Select a PDF to organize" />
          
          {loading && (
            <div className="mt-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-white/60">Loading pages...</p>
            </div>
          )}

          {!loading && pages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-white/50" />
                    Drag to reorder • {activePages.length} pages
                    {deletedCount > 0 && <span className="text-red-400 text-sm ml-2">({deletedCount} to delete)</span>}
                  </h3>
                </div>

                <Reorder.Group axis="y" values={pages} onReorder={setPages} className="space-y-2">
                  {pages.map((page) => (
                    <Reorder.Item key={page.id} value={page} className={`${page.deleted ? "opacity-50" : ""}`}>
                      <motion.div className={`flex items-center gap-4 p-4 rounded-lg ${page.deleted ? "bg-red-500/10 border border-red-500/20" : "bg-white/5"} cursor-grab active:cursor-grabbing`}>
                        <GripVertical className="w-5 h-5 text-white/30 flex-shrink-0" />
                        
                        <div className={`w-12 h-16 rounded bg-white/10 flex items-center justify-center flex-shrink-0 ${page.deleted ? "line-through" : ""}`} style={{ transform: `rotate(${page.rotation}deg)` }}>
                          <span className="text-white/60 text-sm">{page.pageNum}</span>
                        </div>

                        <div className="flex-1">
                          <p className="text-white">Page {page.pageNum}</p>
                          {page.rotation !== 0 && <p className="text-white/50 text-sm">Rotated {page.rotation}°</p>}
                        </div>

                        <div className="flex gap-2">
                          <motion.button onClick={() => rotatePage(page.id)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10" whileTap={{ scale: 0.95 }}>
                            <RotateCw className="w-4 h-4 text-white/70" />
                          </motion.button>
                          <motion.button onClick={() => deletePage(page.id)} className={`p-2 rounded-lg ${page.deleted ? "bg-green-500/20 hover:bg-green-500/30" : "bg-red-500/20 hover:bg-red-500/30"}`} whileTap={{ scale: 0.95 }}>
                            <Trash2 className={`w-4 h-4 ${page.deleted ? "text-green-400" : "text-red-400"}`} />
                          </motion.button>
                        </div>
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>

              <motion.button onClick={handleOrganize} disabled={activePages.length === 0} className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold disabled:opacity-50" whileTap={{ scale: 0.98 }}>
                {activePages.length === 0 ? "Select at least one page" : `Save ${activePages.length} Pages`}
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      <ProcessingStatus status={status} progress={progress} onDownload={handleDownload} downloadLabel="Download PDF" />
      {status === "done" && <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleReset} className="mt-4 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5">Organize another PDF</motion.button>}
    </ToolLayout>
  );
}
