import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PDFUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onRun: () => void;
  isRunning: boolean;
  isCompleted: boolean;
}

const PDFUploader = ({ file, onFileSelect, onRun, isRunning, isCompleted }: PDFUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/30">
      <div className="flex-1">
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
              isDragging 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/30 hover:border-primary/50"
            )}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Drag & drop PDF here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFileSelect(null)}
              disabled={isRunning}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <Button
        onClick={onRun}
        disabled={!file || isRunning || isCompleted}
        className="min-w-[120px]"
      >
        {isRunning ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Processing...
          </>
        ) : isCompleted ? (
          "Completed"
        ) : (
          "Run Agent"
        )}
      </Button>
    </div>
  );
};

export default PDFUploader;
