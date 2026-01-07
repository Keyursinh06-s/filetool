"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { FileImage, GripVertical, RotateCw } from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

interface ImageFile {
  file: File;
  preview: string;
  rotation: number;
  id: string;
}

export default function ImageToPDF() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [pageSize, setPageSize] = useState<"fit" | "a4" | "letter">("fit");
  const [margin, setMargin] = useState(0);

  const handleFilesChange = (files: File[]) => {
    const newImages = files.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      rotation: 0,
      id: `${file.name}-${index}-${Date.now()}`,
    }));
    setImages(newImages);
  };

  const rotateImage = (id: string) => {
    setImages(images.map(img => 
      img.id === id 
        ? { ...img, rotation: (img.rotation + 90) % 360 }
        : img
    ));
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    setStatus("processing");
    setProgress(0);

    try {
      const pdf = await PDFDocument.create();
      const total = images.length;

      for (let i = 0; i < images.length; i++) {
        const { file, rotation } = images[i];
        const arrayBuffer = await file.arrayBuffer();
        
        let image;
        if (file.type === "image/png") {
          image = await pdf.embedPng(arrayBuffer);
        } else {
          image = await pdf.embedJpg(arrayBuffer);
        }

        let width = image.width;
        let height = image.height;

        // Handle rotation
        if (rotation === 90 || rotation === 270) {
          [width, height] = [height, width];
        }

        // Page dimensions
        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === "a4") {
          pageWidth = 595.28;
          pageHeight = 841.89;
        } else if (pageSize === "letter") {
          pageWidth = 612;
          pageHeight = 792;
        } else {
          pageWidth = width + margin * 2;
          pageHeight = height + margin * 2;
        }

        const page = pdf.addPage([pageWidth, pageHeight]);

        // Calculate scale to fit image
        const scale = Math.min(
          (pageWidth - margin * 2) / width,
          (pageHeight - margin * 2) / height
        );

        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        page.drawImage(image, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
          rotate: degrees(rotation),
        });

        setProgress(((i + 1) / total) * 100);
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultBlob(blob);
      setStatus("done");
    } catch (error) {
      console.error("Error converting images to PDF:", error);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
      saveAs(resultBlob, "images.pdf");
    }
  };

  const handleReset = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
    setStatus("idle");
    setProgress(0);
    setResultBlob(null);
  };

  return (
    <ToolLayout
      title="Image to PDF"
      description="Convert images to a PDF document"
      icon={FileImage}
      color="#38bdf8"
    >
      {status === "idle" && (
        <>
          <FileUploader
            files={images.map(i => i.file)}
            onFilesChange={handleFilesChange}
            accept={{
              "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
            }}
            title="Drop your images here"
            subtitle="JPG, PNG, WebP, GIF supported"
          />

          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-white/50" />
                  Drag to reorder • Click to rotate
                </h3>
                
                <Reorder.Group
                  axis="x"
                  values={images}
                  onReorder={setImages}
                  className="flex gap-4 overflow-x-auto pb-4"
                >
                  {images.map((img, index) => (
                    <Reorder.Item
                      key={img.id}
                      value={img}
                      className="cursor-grab active:cursor-grabbing flex-shrink-0"
                    >
                      <motion.div
                        className="relative group"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-32 h-40 rounded-lg overflow-hidden bg-white/5 relative">
                          <img
                            src={img.preview}
                            alt={img.file.name}
                            className="w-full h-full object-cover"
                            style={{ transform: `rotate(${img.rotation}deg)` }}
                          />
                          <div className="absolute top-2 left-2 w-6 h-6 rounded bg-sky-500/80 text-white text-xs flex items-center justify-center">
                            {index + 1}
                          </div>
                        </div>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            rotateImage(img.id);
                          }}
                          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <RotateCw className="w-4 h-4 text-white" />
                        </motion.button>
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>

              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">Page Settings</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "fit", label: "Fit Image", desc: "Auto size" },
                    { id: "a4", label: "A4", desc: "210×297mm" },
                    { id: "letter", label: "Letter", desc: "8.5×11in" },
                  ].map((size) => (
                    <motion.button
                      key={size.id}
                      onClick={() => setPageSize(size.id as typeof pageSize)}
                      className={`p-3 rounded-lg border transition-all ${
                        pageSize === size.id
                          ? "border-sky-500 bg-sky-500/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p className="text-white font-medium text-sm">{size.label}</p>
                      <p className="text-white/50 text-xs">{size.desc}</p>
                    </motion.button>
                  ))}
                </div>

                {pageSize !== "fit" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4"
                  >
                    <label className="text-white/60 text-sm block mb-2">
                      Margin: {margin}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={margin}
                      onChange={(e) => setMargin(parseInt(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                  </motion.div>
                )}
              </div>

              <motion.button
                onClick={handleConvert}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold btn-shine"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 40px -10px rgba(56, 189, 248, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                Create PDF from {images.length} {images.length === 1 ? "Image" : "Images"}
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      <ProcessingStatus
        status={status}
        progress={progress}
        onDownload={handleDownload}
        downloadLabel="Download PDF"
      />

      {status === "done" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleReset}
          className="mt-4 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
        >
          Convert more images
        </motion.button>
      )}
    </ToolLayout>
  );
}

