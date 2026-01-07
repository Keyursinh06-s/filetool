"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Download, FileImage } from "lucide-react";
import { saveAs } from "file-saver";
import ToolLayout from "@/components/ToolLayout";
import FileUploader from "@/components/FileUploader";
import ProcessingStatus from "@/components/ProcessingStatus";

type ImageFormat = "png" | "jpeg";

export default function PDFToImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState<ImageFormat>("png");
  const [quality, setQuality] = useState(90);
  const [resultImages, setResultImages] = useState<{ name: string; dataUrl: string }[]>([]);
  const [pdfjsLib, setPdfjsLib] = useState<typeof import("pdfjs-dist") | null>(null);

  useEffect(() => {
    // Dynamically import pdf.js
    import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      setPdfjsLib(pdfjs);
    });
  }, []);

  const handleConvert = async () => {
    if (files.length === 0 || !pdfjsLib) return;

    setStatus("processing");
    setProgress(0);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const images: { name: string; dataUrl: string }[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        const dataUrl = canvas.toDataURL(
          format === "png" ? "image/png" : "image/jpeg",
          quality / 100
        );

        images.push({
          name: `page-${i}.${format}`,
          dataUrl,
        });

        setProgress((i / numPages) * 100);
      }

      setResultImages(images);
      setStatus("done");
    } catch (error) {
      console.error("Error converting PDF to images:", error);
      setStatus("error");
    }
  };

  const handleDownloadAll = () => {
    resultImages.forEach(({ name, dataUrl }) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = name;
      link.click();
    });
  };

  const handleDownloadSingle = (name: string, dataUrl: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = name;
    link.click();
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setResultImages([]);
  };

  return (
    <ToolLayout
      title="PDF to Image"
      description="Convert PDF pages to high-quality images"
      icon={ImageIcon}
      color="#fb923c"
    >
      {status === "idle" && (
        <>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            maxFiles={1}
            title="Drop your PDF file here"
            subtitle="Each page will be converted to an image"
          />

          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="glass rounded-xl p-6 mb-6">
                <h3 className="text-white font-medium mb-4">Output Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-white/60 text-sm block mb-3">Format</label>
                    <div className="flex gap-3">
                      {(["png", "jpeg"] as ImageFormat[]).map((f) => (
                        <motion.button
                          key={f}
                          onClick={() => setFormat(f)}
                          className={`flex-1 p-4 rounded-lg border transition-all ${
                            format === f
                              ? "border-orange-500 bg-orange-500/10"
                              : "border-white/10 hover:border-white/30"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FileImage className="w-5 h-5 mb-2 mx-auto text-orange-400" />
                          <p className="text-white font-medium uppercase">{f}</p>
                          <p className="text-white/50 text-xs">
                            {f === "png" ? "Lossless quality" : "Smaller file size"}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {format === "jpeg" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <label className="text-white/60 text-sm block mb-3">
                        Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full accent-orange-500"
                      />
                      <div className="flex justify-between text-white/40 text-xs mt-1">
                        <span>Smaller file</span>
                        <span>Better quality</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <motion.button
                onClick={handleConvert}
                disabled={!pdfjsLib}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold btn-shine disabled:opacity-50"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 40px -10px rgba(251, 146, 60, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                {pdfjsLib ? "Convert to Images" : "Loading..."}
              </motion.button>
            </motion.div>
          )}
        </>
      )}

      <ProcessingStatus
        status={status}
        progress={progress}
        onDownload={handleDownloadAll}
        downloadLabel={`Download ${resultImages.length} Images`}
      />

      {status === "done" && resultImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h3 className="text-white font-medium mb-4">Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {resultImages.map(({ name, dataUrl }, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white/5">
                  <img
                    src={dataUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.button
                  onClick={() => handleDownloadSingle(name, dataUrl)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Download className="w-6 h-6 text-white" />
                </motion.button>
                <p className="text-white/60 text-xs text-center mt-2 truncate">{name}</p>
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
          className="mt-6 w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
        >
          Convert another PDF
        </motion.button>
      )}
    </ToolLayout>
  );
}

