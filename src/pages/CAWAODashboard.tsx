import { useState } from "react";
import Header from "@/components/Header";
import { mockCases, getCaseStats, QueueType, CustomerCase } from "@/data/mockCases";
import InvestigationStatsCards from "@/components/investigation/InvestigationStatsCards";
import FlagCountCards from "@/components/investigation/FlagCountCards";
import InvestigationTable from "@/components/investigation/InvestigationTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Calendar, Clock, CalendarDays } from "lucide-react";
import FileUploadButton from "@/components/investigation/FileUploadButton";

const CAWAODashboard = () => {
  const [activeQueue, setActiveQueue] = useState<QueueType>('day-0');
  const [cases, setCases] = useState(mockCases);
  const stats = getCaseStats();

  const handleDataLoaded = (uploadedCases: CustomerCase[]) => {
    setCases(uploadedCases);
  };
  const day0Cases = cases.filter(c => c.queue === 'day-0');
  const day7Cases = cases.filter(c => c.queue === 'day-7');
  const day28Cases = cases.filter(c => c.queue === 'day-28');
  const handleMoveToDay7 = (caseId: string) => {
    setCases(prev => prev.map(c => c.caseId === caseId ? {
      ...c,
      queue: 'day-7' as QueueType,
      status: 'Awaiting Customer' as const
    } : c));
  };
  return <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container py-6 md:py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Investigation Portal</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Credit Account Investigation Portal
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <FileUploadButton onDataLoaded={handleDataLoaded} />
              <Button asChild variant="outline" className="bg-slate-900 text-white border-slate-700 hover:bg-slate-800">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
            Dashboard Overview
          </h2>
          <InvestigationStatsCards />
        </div>

        {/* Flag Counts */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
            Flag Distribution
          </h2>
          <FlagCountCards />
        </div>

        {/* Queue Tabs */}
        <Tabs value={activeQueue} onValueChange={v => setActiveQueue(v as QueueType)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-white border shadow-sm">
              <TabsTrigger value="day-0" className="text-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
                <Clock className="h-4 w-4" />
                Day-0 Queue
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-100 data-[state=active]:bg-slate-700 text-slate-600 data-[state=active]:text-slate-200">
                  {day0Cases.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="day-7" className="text-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
                <Calendar className="h-4 w-4" />
                Day-7 Queue
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-100 data-[state=active]:bg-slate-700 text-slate-600 data-[state=active]:text-slate-200">
                  {day7Cases.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="day-28" className="text-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white gap-2">
                <CalendarDays className="h-4 w-4" />
                Day-28 Queue
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-100 data-[state=active]:bg-slate-700 text-slate-600 data-[state=active]:text-slate-200">
                  {day28Cases.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="day-0" className="mt-0">
            <InvestigationTable cases={day0Cases} queue="day-0" onMoveToDay7={handleMoveToDay7} />
          </TabsContent>

          <TabsContent value="day-7" className="mt-0">
            <InvestigationTable cases={day7Cases} queue="day-7" />
          </TabsContent>

          <TabsContent value="day-28" className="mt-0">
            <InvestigationTable cases={day28Cases} queue="day-28" />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
};
export default CAWAODashboard;