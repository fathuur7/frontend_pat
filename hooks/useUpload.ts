import { useState } from "react";

export function useUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
    } else {
      alert("Please select a valid video file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleSimulation = () => {
    if (!file) return;
    setUploading(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          alert("BOOM! Video successfully uploaded!");
          setFile(null);
          setProgress(0);
        }, 500);
      }
      setProgress(currentProgress);
    }, 400);
  };

  return {
    file,
    setFile,
    isHovering,
    uploading,
    progress,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelection,
    handleSimulation,
  };
}
