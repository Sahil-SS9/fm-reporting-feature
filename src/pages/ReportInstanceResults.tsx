import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ReportResults } from "@/components/reports/ReportResults";
import { mockReportConfigs, mockReportInstances } from "@/data/mockData";

export default function ReportInstanceResults() {
  const { configId, instanceId } = useParams();
  const navigate = useNavigate();

  const config = mockReportConfigs.find(c => c.id === configId);
  const instance = mockReportInstances.find(i => i.id === instanceId);

  if (!config || !instance) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Report not found</h2>
          <Button onClick={() => navigate("/reporting")}>
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy \'at\' h:mm a');
    } catch {
      return 'N/A';
    }
  };

  const handleDownload = () => {
    console.log("Download instance:", instanceId);
    // Would trigger CSV download
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button 
          variant="link" 
          size="sm"
          onClick={() => navigate("/reporting")}
          className="h-auto p-0"
        >
          Reports
        </Button>
        <span>/</span>
        <Button 
          variant="link" 
          size="sm"
          onClick={() => navigate(`/reports/${configId}`)}
          className="h-auto p-0"
        >
          {config.name}
        </Button>
        <span>/</span>
        <span className="font-medium text-foreground">
          {formatDateTime(instance.generatedAt)} Instance
        </span>
      </div>


      {/* Results */}
      <ReportResults 
        config={{
          ...config,
          instanceId: instance.id,
          generatedAt: instance.generatedAt
        }} 
        onBack={() => navigate(`/reports/${configId}?tab=history`)}
      />

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-4 border-t">
        Data as of {formatDateTime(instance.generatedAt)}
      </div>
    </div>
  );
}
