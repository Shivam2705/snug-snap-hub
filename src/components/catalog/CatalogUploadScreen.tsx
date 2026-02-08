import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileSpreadsheet } from "lucide-react";
import { SUPPLIERS } from "@/data/mockCatalogData";

interface CatalogUploadScreenProps {
  onUpload: () => void;
}

const CatalogUploadScreen = ({ onUpload }: CatalogUploadScreenProps) => {
  const [supplier, setSupplier] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setFile("supplier_catalog_jan2026.xlsx");
  };

  const handleBrowse = () => {
    setFile("supplier_catalog_jan2026.xlsx");
  };

  return (
    <div className="space-y-6 p-2">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Catalog Upload</h2>
        <p className="text-sm text-muted-foreground">Upload supplier Excel files for catalog verification</p>
      </div>

      {/* Supplier Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Supplier</label>
        <Select value={supplier} onValueChange={setSupplier}>
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            {SUPPLIERS.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-primary bg-primary/5"
            : file
            ? "border-success/50 bg-success/5"
            : "border-border hover:border-muted-foreground"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={handleBrowse}
      >
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <FileSpreadsheet className="h-10 w-10 text-success" />
            <p className="text-sm font-medium text-foreground">{file}</p>
            <p className="text-xs text-muted-foreground">Ready to upload</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Drag & drop your file here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </div>
            <p className="text-xs text-muted-foreground">Supported formats: .xlsx, .csv</p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <Button
        onClick={onUpload}
        disabled={!file || !supplier}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload & Process Catalog
      </Button>
    </div>
  );
};

export default CatalogUploadScreen;
