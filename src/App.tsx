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
import FinanceAgents from "./pages/FinanceAgents";
import ContactCenterAgents from "./pages/ContactCenterAgents";
import ECommerceAgents from "./pages/ECommerceAgents";
import MerchandisingAgents from "./pages/MerchandisingAgents";
import BaseAgentsText from "./pages/BaseAgentsText";
import BaseAgentsImage from "./pages/BaseAgentsImage";
import BaseAgentsVoice from "./pages/BaseAgentsVoice";
import BaseAgents from "./pages/BaseAgents";
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
          <Route path="/contact-center" element={<ContactCenterAgents />} />
          <Route path="/ecommerce" element={<ECommerceAgents />} />
          <Route path="/finance" element={<FinanceAgents />} />
          <Route path="/cawao" element={<CAWAODashboard />} />
          <Route path="/cawao/agents" element={<CreditAgents />} />
          <Route path="/case/:caseId" element={<CaseDetail />} />
          <Route path="/marketing" element={<MarketingAgentsNew />} />
          <Route path="/marketing/agents" element={<MarketingAgentsNew />} />
          <Route path="/merchandising/agents" element={<MerchandisingAgents />} />
          <Route path="/base-agents" element={<BaseAgents />} />
          <Route path="/base-agents/text" element={<BaseAgentsText />} />
          <Route path="/base-agents/image" element={<BaseAgentsImage />} />
          <Route path="/base-agents/voice" element={<BaseAgentsVoice />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
