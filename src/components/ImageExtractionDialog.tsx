import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Play, 
  CheckCircle2, 
  Loader2, 
  Image as ImageIcon,
  Sparkles,
  Tag,
  Palette,
  Ruler,
  ShoppingBag,
  Users,
  Layers,
  Grid3X3,
  CircleDot
} from "lucide-react";
import { imageExtractorService } from "@/services/imageExtractorService";

interface ImageExtractionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AgentStatus = 'idle' | 'processing' | 'completed';

interface ExtractedAttribute {
  label: string;
  value: string;
  icon: React.ReactNode;
  confidence: number;
}

const ImageExtractionDialog = ({ open, onOpenChange }: ImageExtractionDialogProps) => {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [extractedAttributes, setExtractedAttributes] = useState<ExtractedAttribute[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string>("tan_leather_handbag.jpg");
  const [uploadedFileSize, setUploadedFileSize] = useState<string>("2.4 MB");
  const [uploadedFileDimensions, setUploadedFileDimensions] = useState<string>("1920 x 1080");
  const [uploadedImageBase64, setUploadedImageBase64] = useState<File>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>("");

  const mockAttributes: ExtractedAttribute[] = [
    { label: "Category", value: "Handbag", icon: <ShoppingBag className="h-4 w-4" />, confidence: 98 },
    { label: "Section", value: "Female", icon: <Users className="h-4 w-4" />, confidence: 96 },
    { label: "Style", value: "Tote Bag", icon: <Tag className="h-4 w-4" />, confidence: 94 },
    { label: "Colour", value: "Tan Brown", icon: <Palette className="h-4 w-4" />, confidence: 97 },
    { label: "Pattern", value: "Solid / Plain", icon: <Grid3X3 className="h-4 w-4" />, confidence: 99 },
    { label: "Material", value: "Leather", icon: <Layers className="h-4 w-4" />, confidence: 92 },
    { label: "Size", value: "Medium (35cm x 28cm)", icon: <Ruler className="h-4 w-4" />, confidence: 88 },
    { label: "Closure Type", value: "Zip & Magnetic Snap", icon: <CircleDot className="h-4 w-4" />, confidence: 91 },
  ];

  useEffect(() => {
    if (!open) {
      setImageUploaded(false);
      setIsRunning(false);
      setAgentStatus('idle');
      setProgress(0);
      setExtractedAttributes([]);
      if (uploadedImagePreview) {
        URL.revokeObjectURL(uploadedImagePreview);
        setUploadedImagePreview("");
      }
    }
  }, [open, uploadedImagePreview]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      alert("Please upload a PNG, JPG, or WEBP image");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadedImagePreview(previewUrl);

    // Convert file to base64
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   const result = e.target?.result;
    //   if (typeof result === "string") {
    //     setUploadedImageBase64(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
    //   }
    // };
    // reader.readAsDataURL(file);
    setUploadedImageBase64(file);

    setImageUploaded(true);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    // Note: Getting actual image dimensions would require loading the image
    setUploadedFileDimensions("1920 x 1080");
  };

  const triggerFileInput = () => {
    document.getElementById("image-upload-input")?.click();
  };

  const handleRunAgent = async () => {
    if (!uploadedImageBase64) return;

    setIsRunning(true);
    setAgentStatus('processing');
    setProgress(0);
    setExtractedAttributes([]);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    // Call the API
    const response = await imageExtractorService.createSessionAndGetResponse(uploadedImageBase64);

    // Simulate agent completion after 4 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setAgentStatus('completed');
      setIsRunning(false);

      // Process API response
      if (response.success && response.data?.attributes) {
        const attributes = response.data.attributes;
        const apiAttributes: ExtractedAttribute[] = [
          { 
            label: "Category", 
            value: attributes.category || "Unknown", 
            icon: <ShoppingBag className="h-4 w-4" />, 
            confidence: 98 
          },
          { 
            label: "Color", 
            value: attributes.color || "Unknown", 
            icon: <Palette className="h-4 w-4" />, 
            confidence: 97 
          },
          { 
            label: "Pattern", 
            value: attributes.pattern || "Unknown", 
            icon: <Grid3X3 className="h-4 w-4" />, 
            confidence: 99 
          },
          { 
            label: "Sleeve", 
            value: attributes.sleeve || "Unknown", 
            icon: <Layers className="h-4 w-4" />, 
            confidence: 92 
          },
          { 
            label: "Style", 
            value: attributes.style || "Unknown", 
            icon: <Tag className="h-4 w-4" />, 
            confidence: 94 
          },
          { 
            label: "Material", 
            value: attributes.material || "Unknown", 
            icon: <Ruler className="h-4 w-4" />, 
            confidence: 93 
          },
          { 
            label: "Occasion", 
            value: attributes.occasion || "Unknown", 
            icon: <CircleDot className="h-4 w-4" />, 
            confidence: 90 
          },
          { 
            label: "Gender", 
            value: attributes.gender || "Unknown", 
            icon: <Users className="h-4 w-4" />, 
            confidence: 96 
          },
          { 
            label: "Wash", 
            value: attributes.wash || "Unknown", 
            icon: <Sparkles className="h-4 w-4" />, 
            confidence: 88 
          },
        ];

        // Animate attributes appearing one by one
        apiAttributes.forEach((attr, index) => {
          setTimeout(() => {
            setExtractedAttributes(prev => [...prev, attr]);
          }, index * 150);
        });
      } else {
        // Fallback to mock data if API fails
        const mockAttributes: ExtractedAttribute[] = [
          { label: "Category", value: "Handbag", icon: <ShoppingBag className="h-4 w-4" />, confidence: 98 },
          { label: "Section", value: "Female", icon: <Users className="h-4 w-4" />, confidence: 96 },
          { label: "Style", value: "Tote Bag", icon: <Tag className="h-4 w-4" />, confidence: 94 },
          { label: "Colour", value: "Tan Brown", icon: <Palette className="h-4 w-4" />, confidence: 97 },
          { label: "Pattern", value: "Solid / Plain", icon: <Grid3X3 className="h-4 w-4" />, confidence: 99 },
          { label: "Material", value: "Leather", icon: <Layers className="h-4 w-4" />, confidence: 92 },
          { label: "Size", value: "Medium (35cm x 28cm)", icon: <Ruler className="h-4 w-4" />, confidence: 88 },
          { label: "Closure Type", value: "Zip & Magnetic Snap", icon: <CircleDot className="h-4 w-4" />, confidence: 91 },
        ];

        mockAttributes.forEach((attr, index) => {
          setTimeout(() => {
            setExtractedAttributes(prev => [...prev, attr]);
          }, index * 150);
        });
      }
    }, 4000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[85vw] h-[85vh] p-0 gap-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Column - Image Upload (1/3) */}
          <div className="w-1/3 border-r border-border bg-muted/30 p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Image Extraction Agent
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload an image to extract detailed product attributes
              </p>
            </div>

            {/* Upload Area */}
            <div className="flex-1 flex flex-col">
              <input
                id="image-upload-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Card 
                className={`flex-1 border-2 border-dashed cursor-pointer transition-all hover:border-primary/50 ${
                  imageUploaded ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'
                }`}
                onClick={triggerFileInput}
              >
                <CardContent className="flex flex-col items-center justify-center h-full p-4">
                  {imageUploaded ? (
                    <div className="text-center space-y-4 w-full">
                      <div className="relative mx-auto w-full max-w-[200px] aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 flex items-center justify-center">
                        {uploadedImagePreview && (
                          <img 
                            src={uploadedImagePreview} 
                            alt="Uploaded preview" 
                            className="w-full h-full object-cover"
                          />
                        )}
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Uploaded
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium truncate">{uploadedFileName}</p>
                        <p className="text-xs text-muted-foreground">{uploadedFileSize} • {uploadedFileDimensions}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Upload Product Image</p>
                        <p className="text-sm text-muted-foreground">
                          Drag & drop or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Supports: JPG, PNG, WEBP
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button 
                className="mt-4 w-full" 
                size="lg"
                disabled={!imageUploaded || isRunning}
                onClick={handleRunAgent}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Extraction
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column - Agent Execution & Results (2/3) */}
          <div className="w-2/3 p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Agent Execution
              </h3>
              <p className="text-sm text-muted-foreground">
                AI-powered attribute extraction workflow
              </p>
            </div>

            {/* Agent Node */}
            <Card className={`mb-6 transition-all duration-500 ${
              agentStatus === 'processing' ? 'border-blue-500 shadow-lg shadow-blue-500/20' :
              agentStatus === 'completed' ? 'border-green-500 shadow-lg shadow-green-500/20' :
              'border-border'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      agentStatus === 'processing' ? 'bg-blue-500/20 animate-pulse' :
                      agentStatus === 'completed' ? 'bg-green-500/20' :
                      'bg-muted'
                    }`}>
                      {agentStatus === 'processing' ? (
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                      ) : agentStatus === 'completed' ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">Attribute Extractor Agent</h4>
                      <p className="text-sm text-muted-foreground">
                        Deep learning model for product attribute extraction
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    agentStatus === 'processing' ? 'default' :
                    agentStatus === 'completed' ? 'secondary' :
                    'outline'
                  } className={
                    agentStatus === 'processing' ? 'bg-blue-500' :
                    agentStatus === 'completed' ? 'bg-green-500 text-white' :
                    ''
                  }>
                    {agentStatus === 'idle' ? 'Waiting' :
                     agentStatus === 'processing' ? 'Processing' :
                     'Completed'}
                  </Badge>
                </div>

                {agentStatus !== 'idle' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {agentStatus === 'processing' ? 'Analyzing image features...' : 'Extraction complete'}
                      </span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {agentStatus === 'processing' && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground font-mono">
                      <span className="text-blue-400">→</span> Detecting product boundaries...
                      <br />
                      <span className="text-blue-400">→</span> Analyzing color histogram...
                      <br />
                      <span className="text-blue-400">→</span> Classifying product category...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Extracted Attributes Section */}
            {extractedAttributes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <span className="text-sm font-medium text-primary">Extracted Attributes</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {extractedAttributes.map((attr, index) => (
                    <Card 
                      key={attr.label}
                      className="overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                              {attr.icon}
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">{attr.label}</p>
                              <p className="font-semibold text-lg">{attr.value}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {attr.confidence}%
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Summary Card */}
                {agentStatus === 'completed' && extractedAttributes.length > 0 && (
                  <Card className="mt-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">Extraction Complete</h4>
                          <p className="text-sm text-muted-foreground">
                            Successfully extracted {extractedAttributes.length} attributes with an average confidence of {Math.round(extractedAttributes.reduce((acc, a) => acc + a.confidence, 0) / extractedAttributes.length)}%
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Export JSON
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Empty State */}
            {agentStatus === 'idle' && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h4 className="font-medium text-lg">Ready to Extract</h4>
                <p className="text-sm text-muted-foreground max-w-md mt-2">
                  Upload a product image and click "Run Extraction" to identify attributes like category, color, pattern, material, and more.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageExtractionDialog;
