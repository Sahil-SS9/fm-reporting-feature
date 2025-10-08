import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Edit, 
  Trash2, 
  Plus, 
  MapPin,
  User,
  Phone,
  Mail,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Radio,
  X
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockWorkOrders, mockAssets, mockInvoices } from "@/data/mockData";
import { format } from "date-fns";
import { useState } from "react";

interface PriorityInboxDetailSheetProps {
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PriorityInboxDetailSheet({ item, open, onOpenChange }: PriorityInboxDetailSheetProps) {
  const [comment, setComment] = useState("");

  if (!item) return null;

  const renderWorkOrderDetails = () => {
    const workOrder = mockWorkOrders.find(wo => wo.id === item.id);
    if (!workOrder) return null;

    return (
      <>
        <SheetHeader>
          <div className="flex items-start justify-between">
            <SheetTitle className="text-base font-normal text-foreground pr-8">
              {workOrder.title}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription className="sr-only">Work order details and information</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add work order
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <p className="text-sm text-muted-foreground mt-1">{workOrder.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <Select defaultValue={workOrder.status}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">Request Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Name</label>
                    <p className="text-sm text-muted-foreground mt-1">John Smith</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Contact Number</label>
                    <p className="text-sm text-muted-foreground mt-1">555-0123</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Contact email</label>
                    <p className="text-sm text-muted-foreground mt-1">john.smith@example.com</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Store Name</label>
                    <p className="text-sm text-muted-foreground mt-1">{workOrder.property}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Details</label>
                    <p className="text-sm text-muted-foreground mt-1">{workOrder.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Where is the issue located</label>
                    <p className="text-sm text-muted-foreground mt-1">In store</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Other details</label>
                    <p className="text-sm text-muted-foreground mt-1">None</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Image Upload</label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Property</label>
                  <p className="text-sm text-muted-foreground mt-1">{workOrder.property}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Store</label>
                  <p className="text-sm text-muted-foreground mt-1">{workOrder.property}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Assignee</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">JS</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">John Smith</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Assigned contractor</label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Assigned Assets</label>
                <p className="text-sm text-muted-foreground mt-1">No assets assigned</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Comments</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">SS</AvatarFallback>
                  </Avatar>
                  <Textarea 
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button size="sm">Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setComment("")}>Cancel</Button>
                  </div>
                  <Select defaultValue="public">
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <p className="text-sm text-muted-foreground">Activity history will appear here.</p>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  const renderInvoiceDetails = () => {
    const invoice = mockInvoices.find(inv => inv.id === item.id);
    
    // Helper to create a valid date or fallback
    const getValidDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? new Date().toISOString().split('T')[0] : dateStr;
    };
    
    // Fallback to creating invoice from item data if not found in mockInvoices
    const invoiceData = invoice || {
      id: item.id,
      type: "Received" as const,
      invoiceNumber: item.title.includes("#") ? item.title.split("#")[1] : "INV-001",
      description: "Service invoice",
      contractorTenant: "Contractor",
      amount: 5000.00,
      dateIssued: "2025-01-15",
      dueDate: getValidDate(item.dueDate || "2025-01-30"),
      paymentStatus: item.status as any,
      taxRate: 0,
      propertyId: "1"
    };

    return (
      <>
        <SheetHeader>
          <div className="flex items-start justify-between">
            <SheetTitle className="text-base font-semibold text-foreground">
              Invoice details
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription className="sr-only">Invoice details and payment information</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm" variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Invoice Type</label>
                <p className="text-sm text-muted-foreground mt-1">{invoiceData.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Invoice Number</label>
                <p className="text-sm text-muted-foreground mt-1">{invoiceData.invoiceNumber}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Description of Services</label>
              <p className="text-sm text-muted-foreground mt-1">{invoiceData.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Contractor / Tenant</label>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {invoiceData.contractorTenant ? invoiceData.contractorTenant.substring(0, 2).toUpperCase() : "-"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{invoiceData.contractorTenant || "-"}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Amount</label>
                <p className="text-sm text-muted-foreground mt-1">£ {invoiceData.amount.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Date Issued</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {(() => {
                    if (!invoiceData.dateIssued) return "No issued date";
                    const date = new Date(invoiceData.dateIssued);
                    return isNaN(date.getTime()) ? "Invalid date" : format(date, "dd/MM/yyyy");
                  })()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Due Date</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {(() => {
                    if (!invoiceData.dueDate) return "No due date";
                    const date = new Date(invoiceData.dueDate);
                    return isNaN(date.getTime()) ? "Invalid date" : format(date, "dd/MM/yyyy");
                  })()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Payment Status</label>
                <Select defaultValue={invoiceData.paymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Outstanding">Outstanding</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Tax Rate</label>
                <p className="text-sm text-muted-foreground mt-1">
                  Basic Rate ({invoiceData.taxRate || 0}%)
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Payment Date</label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <span className="text-sm text-muted-foreground">
                  {(() => {
                    if (invoiceData.paymentStatus !== "Paid") return "Not paid";
                    if (!invoiceData.dateIssued) return "Not paid";
                    const date = new Date(invoiceData.dateIssued);
                    return isNaN(date.getTime()) ? "Not paid" : format(date, "dd/MM/yyyy");
                  })()}
                </span>
                <Calendar className="h-4 w-4 ml-auto text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAssetDetails = () => {
    const asset = mockAssets.find(a => a.id === item.id);
    // Fallback to creating asset from item data if not found in mockAssets
    const assetData = asset || {
      id: item.id,
      name: item.title,
      group: "HVAC Systems",
      status: "Operational" as const,
      condition: "Good" as const,
      description: "Asset requiring maintenance",
      serialNumber: "HVAC-2024-001",
      purchaseCost: 85000,
      depreciationRate: 0.08,
      estimatedValue: 78200,
      estimatedLifetime: 20,
      installationDate: "2024-07-24",
      contractorResponsible: undefined,
      warrantyExpirationDate: undefined,
      location: "Building",
      propertyId: "1",
      type: "HVAC System",
      lastInspection: "2024-10-15",
      nextInspection: "2025-01-15",
      purchaseDate: "2024-07-24"
    };

    return (
      <>
        <SheetHeader>
          <div className="flex items-start justify-between">
            <SheetTitle className="text-base font-semibold text-foreground pr-8">
              {assetData.name}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription className="sr-only">Asset details and maintenance information</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Asset Details</TabsTrigger>
            <TabsTrigger value="workorders">Assigned Work Orders</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Radio className="h-4 w-4 mr-2" />
                Broadcast
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground">Asset Image</label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-8 bg-muted/30 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No image available</p>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                    <div className="w-32 h-32 bg-foreground/10 flex items-center justify-center">
                      <div className="text-xs text-center text-muted-foreground">QR Code</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Asset Name</label>
                  <p className="text-sm text-muted-foreground mt-1">{assetData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Group</label>
                  <p className="text-sm text-muted-foreground mt-1">{assetData.group || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                  <Select defaultValue={assetData.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operational">Operational</SelectItem>
                      <SelectItem value="Pending Repair">Pending Repair</SelectItem>
                      <SelectItem value="Missing">Missing</SelectItem>
                      <SelectItem value="Out of Service">Out of Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Asset Activity Since Creation</label>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Operational</span>
                      <span className="text-muted-foreground">Out of Service</span>
                    </div>
                    <div className="flex h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary" style={{ width: "100%" }} />
                      <div className="bg-destructive" style={{ width: "0%" }} />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-muted-foreground">76 days (100%)</span>
                      <span className="text-muted-foreground">0 days (0%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Serial Number</label>
                  <p className="text-sm text-muted-foreground mt-1">{assetData.serialNumber || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Contractor responsible</label>
                  <p className="text-sm text-muted-foreground mt-1">{assetData.contractorResponsible || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Installation date</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(() => {
                      if (!assetData.installationDate) return "-";
                      const date = new Date(assetData.installationDate);
                      return isNaN(date.getTime()) ? "-" : format(date, "dd/MM/yyyy");
                    })()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Purchase cost</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {assetData.purchaseCost ? `£${assetData.purchaseCost.toFixed(2)}` : "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Depreciation Rate</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {assetData.depreciationRate ? `${assetData.depreciationRate}%` : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Estimated value</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {assetData.estimatedValue ? `£${assetData.estimatedValue.toFixed(2)}` : "-"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Estimated lifetime</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {assetData.estimatedLifetime ? `${assetData.estimatedLifetime} years` : "-"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Warranty expiration date</label>
                <p className="text-sm text-muted-foreground mt-1">
                  {(() => {
                    if (!assetData.warrantyExpirationDate) return "-";
                    const date = new Date(assetData.warrantyExpirationDate);
                    return isNaN(date.getTime()) ? "-" : format(date, "dd/MM/yyyy");
                  })()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Tags</label>
                <p className="text-sm text-muted-foreground mt-1">No tags assigned</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Tags</label>
                <p className="text-sm text-muted-foreground mt-1">No tags assigned</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Documents</label>
                <p className="text-sm text-muted-foreground mt-1">No documents assigned</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Invoices</label>
                <p className="text-sm text-muted-foreground mt-1">No invoices assigned</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workorders" className="mt-6">
            <p className="text-sm text-muted-foreground">Assigned work orders will appear here.</p>
          </TabsContent>

          <TabsContent value="maintenance" className="mt-6">
            <p className="text-sm text-muted-foreground">Maintenance plans will appear here.</p>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  const renderDocumentDetails = () => {
    return (
      <>
        <SheetHeader>
          <div className="flex items-start justify-between">
            <SheetTitle className="text-base font-semibold text-foreground pr-8">
              {item.title}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription className="sr-only">Document details and expiry information</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm" variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>

          <Separator />

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">Document Name</label>
              <p className="text-sm text-muted-foreground mt-1">{item.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Document Type</label>
                <p className="text-sm text-muted-foreground mt-1">Certificate</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <Badge variant="destructive" className="mt-1">{item.label}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Property</label>
                <p className="text-sm text-muted-foreground mt-1">{item.property}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Expiry Date</label>
                <p className="text-sm text-muted-foreground mt-1">{item.dueDate}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Last Modified</label>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(), "MMM dd, yyyy HH:mm")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">File Size</label>
              <p className="text-sm text-muted-foreground mt-1">2.4 MB</p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <p className="text-sm text-muted-foreground mt-1">
                Annual fire safety inspection certificate for the property. This document must be renewed before expiry to maintain compliance.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderDetails = () => {
    switch (item.type) {
      case "work_order":
        return renderWorkOrderDetails();
      case "invoice":
        return renderInvoiceDetails();
      case "asset":
      case "inspection":
        return renderAssetDetails();
      case "document":
        return renderDocumentDetails();
      default:
        return <p className="text-sm text-muted-foreground">Details not available for this item type.</p>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
        {renderDetails()}
      </SheetContent>
    </Sheet>
  );
}
