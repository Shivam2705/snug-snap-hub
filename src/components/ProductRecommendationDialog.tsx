import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Play, 
  Loader2, 
  CheckCircle2, 
  Image as ImageIcon,
  Scan,
  Database,
  Sparkles,
  ArrowRight,
  X,
  Heart,
  ShoppingBag,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { nextLensService } from "@/services/nextLensService";

interface ProductRecommendationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WorkflowNode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "pending" | "running" | "completed";
  output?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  matchScore: number;
  attributes: string[];
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Navy Slim Fit Blazer",
    price: 89,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    matchScore: 96,
    attributes: ["Slim Fit", "Navy", "Single Breasted"]
  },
  {
    id: "2", 
    name: "Classic Black Blazer",
    price: 110,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    matchScore: 92,
    attributes: ["Regular Fit", "Black", "Two Button"]
  },
  {
    id: "3",
    name: "Charcoal Wool Blazer",
    price: 145,
    originalPrice: 180,
    image: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=400&h=500&fit=crop",
    matchScore: 89,
    attributes: ["Wool Blend", "Charcoal", "Notch Lapel"]
  },
  {
    id: "4",
    name: "Tan Linen Blazer",
    price: 95,
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=500&fit=crop",
    matchScore: 85,
    attributes: ["Linen", "Tan", "Casual"]
  },
  {
    id: "5",
    name: "Grey Herringbone Blazer",
    price: 135,
    originalPrice: 165,
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop",
    matchScore: 82,
    attributes: ["Herringbone", "Grey", "Formal"]
  },
  {
    id: "6",
    name: "Burgundy Velvet Blazer",
    price: 160,
    image: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=400&h=500&fit=crop",
    matchScore: 78,
    attributes: ["Velvet", "Burgundy", "Evening"]
  }
];

const ProductRecommendationDialog = ({ open, onOpenChange }: ProductRecommendationDialogProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("execution");
  const [apiResponse, setApiResponse] = useState<any>([]);
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([
    {
      id: "extractor",
      name: "Attribute Extractor Agent",
      description: "Analyzing image to extract style attributes, colors, patterns, and garment type",
      icon: <Scan className="h-5 w-5" />,
      status: "pending"
    },
    {
      id: "inventory",
      name: "Inventory Lookup Agent", 
      description: "Searching NEXT.co.uk catalog for matching products based on extracted attributes",
      icon: <Database className="h-5 w-5" />,
      status: "pending"
    },
    {
      id: "stylist",
      name: "Fashion Stylist Agent",
      description: "Ranking and curating recommendations based on style compatibility and trends",
      icon: <Sparkles className="h-5 w-5" />,
      status: "pending"
    }
  ]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Please upload a PNG or JPG image");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Store the file object and convert to base64 for display
    setUploadedImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setUploadedImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    document.getElementById("image-upload-input")?.click();
  };

  const runWorkflow = async () => {
    if (!uploadedImage || !uploadedImageFile) return;
    
    setIsRunning(true);
    setIsCompleted(false);
    setApiResponse([]);
    setActiveTab("execution");

    // Reset nodes
    setWorkflowNodes(prev => prev.map(node => ({ ...node, status: "pending" as const, output: undefined })));

    // Simulate Attribute Extractor
    await new Promise(resolve => setTimeout(resolve, 800));
    setWorkflowNodes(prev => prev.map(node => 
      node.id === "extractor" ? { ...node, status: "running" as const } : node
    ));
    await new Promise(resolve => setTimeout(resolve, 1500));
    setWorkflowNodes(prev => prev.map(node => 
      node.id === "extractor" ? { 
        ...node, 
        status: "completed" as const,
        output: "Detected: Blazer | Color: Navy Blue | Fit: Slim | Style: Single-breasted | Fabric: Wool blend | Pattern: Solid"
      } : node
    ));

    // Simulate Inventory Lookup
    await new Promise(resolve => setTimeout(resolve, 500));
    setWorkflowNodes(prev => prev.map(node => 
      node.id === "inventory" ? { ...node, status: "running" as const } : node
    ));
    await new Promise(resolve => setTimeout(resolve, 1800));
    setWorkflowNodes(prev => prev.map(node => 
      node.id === "inventory" ? { 
        ...node, 
        status: "completed" as const,
        output: "Found 247 potential matches | Filtered to 42 high-relevance items | Categories: Men's Blazers, Suit Jackets, Smart Casual"
      } : node
    ));

    // Simulate Fashion Stylist and call API
    await new Promise(resolve => setTimeout(resolve, 500));
    setWorkflowNodes(prev => prev.map(node => 
      node.id === "stylist" ? { ...node, status: "running" as const } : node
    ));

    // Call the API with the File object
    const response = await nextLensService.createSessionAndGetResponse(uploadedImageFile);

    if (response.success && response.data) {
      console.log("API Response - Products Array:", response.data);
      setApiResponse(response.data);
    } else {
      
      console.error("API Error:", response.error);
      // Don't use fallback, wait for real API response
    }

    await new Promise(resolve => setTimeout(resolve, 1200));
    setWorkflowNodes(prev => prev.map(node => 
      node.id === "stylist" ? { 
        ...node, 
        status: "completed" as const,
        output: "Curated 6 top recommendations | Ranked by style match (78-96%) | Applied trend weighting for A/W 2024"
      } : node
    ));

    setIsRunning(false);
    setIsCompleted(true);
    
    // Auto-switch to results tab
    setTimeout(() => {
      setActiveTab("results");
    }, 800);
  };

  const handleClose = () => {
    setUploadedImage(null);
    setUploadedImageFile(null);
    setIsRunning(false);
    setIsCompleted(false);
    setActiveTab("execution");
    setApiResponse([]);
    setWorkflowNodes(prev => prev.map(node => ({ ...node, status: "pending" as const, output: undefined })));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="flex h-full flex-col lg:flex-row">
          {/* Left Panel - Input Section */}
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r bg-muted/30 p-4 lg:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">NEXT Lens</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Image-based search to find similar products
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Upload Area */}
            <div className="flex-1 flex flex-col gap-4 min-h-0 max-h-[calc(100vh-300px)]">
              <label className="text-sm font-medium">Upload Image</label>
              <input
                id="image-upload-input"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div 
                className={cn(
                  "flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors min-h-0 overflow-hidden",
                  uploadedImage ? "border-primary/50 bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
                )}
                onClick={triggerFileInput}
              >
                {uploadedImage ? (
                  <div className="relative w-full h-full p-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded blazer"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                    <Badge className="absolute top-6 right-6 bg-green-500/90">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Uploaded
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium mb-1">Click to upload image</p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Extracted Attributes Preview */}
              {isCompleted && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 shrink-0">
                  <p className="text-sm font-medium text-primary mb-2">Detected Attributes</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Blazer</Badge>
                    <Badge variant="secondary">Navy Blue</Badge>
                    <Badge variant="secondary">Slim Fit</Badge>
                    <Badge variant="secondary">Wool Blend</Badge>
                  </div>
                </div>
              )}

              {/* Run Button */}
              <Button 
                className="w-full gradient-exl shrink-0" 
                size="lg"
                onClick={runWorkflow}
                disabled={!uploadedImage || isRunning}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Agent
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Panel - Tabs Section */}
          <div className="w-full lg:w-2/3 flex flex-col min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
              <div className="border-b px-6 pt-4">
                <TabsList className="grid w-[400px] grid-cols-2">
                  <TabsTrigger value="execution" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Agent Execution
                  </TabsTrigger>
                  <TabsTrigger value="results" className="gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Similar Styles
                    {isCompleted && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5">6</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Agent Execution Tab */}
              <TabsContent value="execution" className="flex-1 p-4 lg:p-6 mt-0 overflow-y-auto min-h-0">
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-1">Multi-Agent Workflow</h3>
                    <p className="text-sm text-muted-foreground">
                      Watch as our AI agents collaborate to find your perfect style match
                    </p>
                  </div>

                  {/* Workflow Nodes */}
                  <div className="relative">
                    {workflowNodes.map((node, index) => (
                      <div key={node.id} className="relative">
                        {/* Connector Line */}
                        {index < workflowNodes.length - 1 && (
                          <div className="absolute left-7 top-[72px] w-0.5 h-8 bg-border" />
                        )}
                        
                        <div className={cn(
                          "p-4 rounded-xl border-2 transition-all duration-500 mb-4",
                          node.status === "pending" && "bg-muted/30 border-muted",
                          node.status === "running" && "bg-primary/10 border-primary shadow-lg shadow-primary/20",
                          node.status === "completed" && "bg-green-500/10 border-green-500/50"
                        )}>
                          <div className="flex items-start gap-4">
                            {/* Status Icon */}
                            <div className={cn(
                              "h-14 w-14 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                              node.status === "pending" && "bg-muted text-muted-foreground",
                              node.status === "running" && "bg-primary text-primary-foreground animate-pulse",
                              node.status === "completed" && "bg-green-500 text-white"
                            )}>
                              {node.status === "running" ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                              ) : node.status === "completed" ? (
                                <CheckCircle2 className="h-6 w-6" />
                              ) : (
                                node.icon
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{node.name}</h4>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-xs",
                                    node.status === "running" && "border-primary text-primary",
                                    node.status === "completed" && "border-green-500 text-green-500"
                                  )}
                                >
                                  {node.status === "pending" ? "Waiting" : 
                                   node.status === "running" ? "Processing" : "Complete"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {node.description}
                              </p>
                              
                              {/* Output */}
                              {node.output && (
                                <div className="mt-3 p-3 bg-background rounded-lg border text-sm">
                                  <p className="text-xs font-medium text-green-500 mb-1">Output:</p>
                                  <p className="text-muted-foreground">{node.output}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Arrow between nodes */}
                        {index < workflowNodes.length - 1 && node.status === "completed" && (
                          <div className="flex justify-center -mt-2 mb-2">
                            <ArrowRight className="h-5 w-5 text-green-500 rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Completion Message */}
                  {isCompleted && (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                        <div>
                          <p className="font-semibold text-green-500">Analysis Complete!</p>
                          <p className="text-sm text-muted-foreground">
                            Found 6 matching products. Switch to "Similar Styles" tab to view recommendations.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!isRunning && !isCompleted && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Sparkles className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold mb-2">Ready to Analyze</h4>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Upload an image and click "Run Agent" to start the multi-agent workflow. 
                        Our AI agents will extract attributes, search inventory, and curate style recommendations.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Similar Styles Tab */}
              <TabsContent value="results" className="flex-1 p-4 lg:p-6 mt-0 overflow-y-auto min-h-0">
                {isCompleted && apiResponse ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold">Similar Styles from NEXT</h3>
                        <p className="text-sm text-muted-foreground">
                          {apiResponse?.length || 0} products matching your uploaded style
                        </p>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        Sorted by Match Score
                      </Badge>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {apiResponse && apiResponse?.map((product: any, idx: number) => (
                        <div 
                          key={product.id || idx}
                          className="group bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all hover:border-primary/50"
                        >
                          {/* Product Image */}
                          <div className="relative aspect-[3/4] overflow-hidden bg-muted flex items-center justify-center">
                            <img 
                              src={`/assets/products/${product.id}.jpg`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="p-4">
                            <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h4>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="font-semibold">£{product.price}</span>
                            </div>
                            {/* Product Details */}
                            <div className="space-y-2 text-xs">
                              <div>
                                <p className="text-muted-foreground">Category</p>
                                <Badge variant="outline" className="text-xs mt-1">{product.category}</Badge>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Color</p>
                                <Badge variant="outline" className="text-xs mt-1">{product.color}</Badge>
                              </div>
                            </div>
                            {/* Quick Add */}
                            <Button size="sm" className="w-full mt-3 bg-primary hover:bg-primary/90">
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              Add to Bag
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message from API */}
                    <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                      <p className="text-sm text-primary">Here are the top matching products from NEXT.co.uk based on your uploaded style!</p>
                    </div>
                  </div>
                ) : isCompleted && !isRunning ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                    <h4 className="font-semibold mb-2">No Products Found</h4>
                    <p className="text-sm text-muted-foreground max-w-md">
                      The API is processing your request. Please try again.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                    </div>
                    <h4 className="font-semibold mb-2">Analyzing Your Style...</h4>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Our AI agents are finding the perfect matches for you. This may take a moment.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductRecommendationDialog;
