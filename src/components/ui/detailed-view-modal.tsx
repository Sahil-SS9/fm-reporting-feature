import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download } from "lucide-react";

interface DetailedViewModalProps {
  title: string;
  children: React.ReactNode;
  chartComponent: React.ReactNode;
  tableData: Array<Record<string, any>>;
  tableColumns: Array<{
    key: string;
    label: string;
    format?: (value: any) => string;
  }>;
}

export function DetailedViewModal({
  title,
  children,
  chartComponent,
  tableData,
  tableColumns
}: DetailedViewModalProps) {
  const handleExport = () => {
    const csvContent = [
      tableColumns.map(col => col.label).join(','),
      ...tableData.map(row => 
        tableColumns.map(col => {
          const value = row[col.key];
          return col.format ? col.format(value) : value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title} - Detailed View</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Enhanced Chart Section */}
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {chartComponent}
              </div>
            </CardContent>
          </Card>

          {/* Data Table Section */}
          <Card>
            <CardHeader>
              <CardTitle>Data Table</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableColumns.map(column => (
                      <TableHead key={column.key}>{column.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      {tableColumns.map(column => (
                        <TableCell key={column.key}>
                          {column.format ? column.format(row[column.key]) : row[column.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}