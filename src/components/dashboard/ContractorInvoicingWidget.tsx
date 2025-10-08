import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const contractorData = [
  { name: "ABC Plumbing", invoices: 15420, jobs: 12 },
  { name: "Elite HVAC", invoices: 28750, jobs: 18 },
  { name: "ProClean Services", invoices: 8900, jobs: 24 },
  { name: "SecureElectric", invoices: 19200, jobs: 8 },
  { name: "GreenLandscape", invoices: 12300, jobs: 15 },
  { name: "FastFix Repairs", invoices: 22100, jobs: 20 }
];

const detailedContractorData = [
  { contractor: "ABC Plumbing", totalInvoiced: 15420, jobsCompleted: 12, avgPerJob: 1285, lastInvoice: "2024-01-15", status: "Paid" },
  { contractor: "Elite HVAC", totalInvoiced: 28750, jobsCompleted: 18, avgPerJob: 1597, lastInvoice: "2024-01-18", status: "Pending" },
  { contractor: "ProClean Services", totalInvoiced: 8900, jobsCompleted: 24, avgPerJob: 371, lastInvoice: "2024-01-20", status: "Paid" },
  { contractor: "SecureElectric", totalInvoiced: 19200, jobsCompleted: 8, avgPerJob: 2400, lastInvoice: "2024-01-14", status: "Overdue" },
  { contractor: "GreenLandscape", totalInvoiced: 12300, jobsCompleted: 15, avgPerJob: 820, lastInvoice: "2024-01-19", status: "Paid" },
  { contractor: "FastFix Repairs", totalInvoiced: 22100, jobsCompleted: 20, avgPerJob: 1105, lastInvoice: "2024-01-21", status: "Pending" }
];

export function ContractorInvoicingWidget() {
  const totalInvoiced = contractorData.reduce((sum, contractor) => sum + contractor.invoices, 0);
  const totalJobs = contractorData.reduce((sum, contractor) => sum + contractor.jobs, 0);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'Paid': 'bg-green-500/10 text-green-700 dark:text-green-400',
      'Pending': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
      'Overdue': 'bg-red-500/10 text-red-700 dark:text-red-400'
    };
    return (
      <Badge variant="secondary" className={statusStyles[status as keyof typeof statusStyles]}>
        {status}
      </Badge>
    );
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-primary" />
          <span>Contractor Invoicing</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-foreground">${totalInvoiced.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total this month</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-foreground">{totalJobs}</p>
              <p className="text-xs text-muted-foreground">Jobs completed</p>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Invoiced']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="invoices" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contractor</TableHead>
                  <TableHead className="text-right">Total Invoiced</TableHead>
                  <TableHead className="text-right">Jobs Completed</TableHead>
                  <TableHead className="text-right">Avg Per Job</TableHead>
                  <TableHead>Last Invoice</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedContractorData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.contractor}</TableCell>
                    <TableCell className="text-right">${row.totalInvoiced.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{row.jobsCompleted}</TableCell>
                    <TableCell className="text-right">${row.avgPerJob.toLocaleString()}</TableCell>
                    <TableCell>{row.lastInvoice}</TableCell>
                    <TableCell>{getStatusBadge(row.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}