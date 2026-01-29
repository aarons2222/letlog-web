'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileDown, Loader2, FileText, ClipboardCheck, Search } from 'lucide-react';

interface ExportInventoryButtonProps {
  propertyId: string;
  propertyAddress?: string;
}

type ReportType = 'check-in' | 'check-out' | 'interim';

export function ExportInventoryButton({ propertyId, propertyAddress }: ExportInventoryButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<ReportType | null>(null);

  const handleExport = async (reportType: ReportType) => {
    setIsExporting(true);
    setExportType(reportType);

    try {
      const response = await fetch('/api/inventory/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          reportType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to export inventory');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `inventory-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) {
          filename = match[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Export error:', error);
      alert(error.message || 'Failed to export inventory. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const getIcon = (type: ReportType) => {
    switch (type) {
      case 'check-in':
        return <FileText className="w-4 h-4 mr-2" />;
      case 'check-out':
        return <ClipboardCheck className="w-4 h-4 mr-2" />;
      case 'interim':
        return <Search className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={() => handleExport('check-in')}
          disabled={isExporting}
        >
          {getIcon('check-in')}
          Check-In Inventory
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('check-out')}
          disabled={isExporting}
        >
          {getIcon('check-out')}
          Check-Out Inventory
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('interim')}
          disabled={isExporting}
        >
          {getIcon('interim')}
          Interim Inspection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ExportInventoryButton;
