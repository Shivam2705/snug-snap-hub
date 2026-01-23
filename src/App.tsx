import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CAWAODashboard from "./pages/CAWAODashboard";
import CaseDetail from "./pages/CaseDetail";
import CreditAgents from "./pages/CreditAgents";
import MarketingAgentsNew from "./pages/MarketingAgentsNew";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cawao" element={<CAWAODashboard />} />
          <Route path="/cawao/agents" element={<CreditAgents />} />
          <Route path="/case/:caseId" element={<CaseDetail />} />
          <Route path="/marketing" element={<MarketingAgentsNew />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;