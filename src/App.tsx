import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import LivingLedger from "./pages/LivingLedger";
import DiscoveryInterview from "./pages/DiscoveryInterview";
import KnowledgeClone from "./pages/KnowledgeClone";
import EnduranceCommand from "./pages/EnduranceCommand";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LivingLedger />} />
            <Route path="/discovery" element={<DiscoveryInterview />} />
            <Route path="/knowledge" element={<KnowledgeClone />} />
            <Route path="/command" element={<EnduranceCommand />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
