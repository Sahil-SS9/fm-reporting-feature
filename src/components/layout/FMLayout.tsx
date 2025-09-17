import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FMSidebar } from "./FMSidebar";
import { Bell, Settings, User, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockProperties } from "@/data/mockData";
import { useDashboardContext } from "@/pages/Dashboard";
import { useState } from "react";

interface FMLayoutProps {
  children: React.ReactNode;
}

export function FMLayout({ children }: FMLayoutProps) {
  const [selectedProperty, setSelectedProperty] = useState("all");
  
  // Try to get dashboard context, but don't break if not available
  let currentTab = "overview";
  let isPropertyTab = false;
  
  try {
    const dashboardContext = useDashboardContext();
    currentTab = dashboardContext.currentTab;
    isPropertyTab = currentTab === "property";
  } catch {
    // Context not available, use defaults
  }
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <FMSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-80 bg-muted/50"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Property Filter Dropdown */}
              <div className="relative">
                <Select 
                  value={selectedProperty} 
                  onValueChange={setSelectedProperty}
                  disabled={isPropertyTab}
                >
                  <SelectTrigger className={`w-48 ${isPropertyTab ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Properties" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="all">All Properties</SelectItem>
                    {mockProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Help</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">Sarah Thompson</div>
                      <div className="text-xs text-muted-foreground">Property Manager</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Account Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}