import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reporting from "./pages/Reporting";
import ReportConfigDetail from "./pages/ReportConfigDetail";
import ReportInstanceResults from "./pages/ReportInstanceResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen w-full bg-background">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/reports/:configId" element={<ReportConfigDetail />} />
            <Route path="/reports/:configId/instances/:instanceId/results" element={<ReportInstanceResults />} />
            <Route path="/schedule" element={<div className="p-6"><h1 className="text-2xl font-bold">Schedule</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/assets" element={<div className="p-6"><h1 className="text-2xl font-bold">Assets & Maintenance</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/cases" element={<div className="p-6"><h1 className="text-2xl font-bold">Cases & Work Orders</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/inspection" element={<div className="p-6"><h1 className="text-2xl font-bold">Inspection & Compliance</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            <Route path="/documentation" element={<div className="p-6"><h1 className="text-2xl font-bold">Documentation</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
