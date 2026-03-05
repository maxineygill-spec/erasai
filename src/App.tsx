import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import FounderOnboarding from "./pages/FounderOnboarding";
import FounderDashboard from "./pages/FounderDashboard";
import EmployeeOnboarding from "./pages/EmployeeOnboarding";
import EmployeeLedger from "./pages/EmployeeLedger";
import DiscoveryInterview from "./pages/DiscoveryInterview";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/founder" element={<FounderOnboarding />} />
          <Route element={<DashboardLayout role="founder" />}>
            <Route path="/founder/dashboard" element={<FounderDashboard />} />
          </Route>
          <Route path="/employee" element={<EmployeeOnboarding />} />
          <Route element={<DashboardLayout role="employee" />}>
            <Route path="/employee/ledger" element={<EmployeeLedger />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
