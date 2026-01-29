import { useState, useMemo } from "react";
import Header from "@/components/Header";
import { mockCases, getCaseStats, getFlagCounts, QueueType, CustomerCase, CaseStatus } from "@/data/mockCases";
import InvestigationStatsCards from "@/components/investigation/InvestigationStatsCards";
import FlagCountCards, { FlagFilter } from "@/components/investigation/FlagCountCards";
import InvestigationTable from "@/components/investigation/InvestigationTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Calendar, Clock, CalendarDays, LayoutGrid } from "lucide-react";
import FileUploadButton from "@/components/investigation/FileUploadButton";

type TabType = 'schedule' | QueueType;

const CAWAODashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [cases, setCases] = useState(mockCases);
  const [statusFilter, setStatusFilter] = useState<CaseStatus | null>(null);
  const [flagFilter, setFlagFilter] = useState<FlagFilter>(null);

  const handleDataLoaded = (uploadedCases: CustomerCase[]) => {
    setCases(uploadedCases);
  };

  // Calculate stats based on current cases
  const stats = useMemo(() => {
    const total = cases.length;
    const inProgress = cases.filter(c => c.status === 'In Progress').length;
    const completed = cases.filter(c => c.status === 'Completed').length;
    const reviewRequired = cases.filter(c => c.status === 'Review Required').length;
    const notStarted = cases.filter(c => c.status === 'Not Started').length;
    const awaitingCustomer = cases.filter(c => c.status === 'Awaiting Customer').length;

    return { total, inProgress, completed, reviewRequired, notStarted, awaitingCustomer };
  }, [cases]);

  const flags = useMemo(() => {
    const cifasCount = cases.filter(c => c.cifas).length;
    const nocCount = cases.filter(c => c.noc).length;
    const authCode2 = cases.filter(c => c.authenticateCode === 2).length;
    const authCode3 = cases.filter(c => c.authenticateCode === 3).length;
    const authCode4 = cases.filter(c => c.authenticateCode === 4).length;
    const zownCount = cases.filter(c => c.zown).length;

    return { cifasCount, nocCount, authCode2, authCode3, authCode4, zownCount };
  }, [cases]);

  const day0Cases = cases.filter(c => c.queue === 'day-0');
  const day7Cases = cases.filter(c => c.queue === 'day-7');
  const day28Cases = cases.filter(c => c.queue === 'day-28');
  const allCases = cases;

  const handleMoveToDay7 = (caseId: string) => {
    setCases(prev => prev.map(c => c.caseId === caseId ? {
      ...c,
      queue: 'day-7' as QueueType,
      status: 'Awaiting Customer' as const
    } : c));
  };

  const handleStatusFilterChange = (filter: CaseStatus | null) => {
    setStatusFilter(filter);
    setFlagFilter(null); // Clear flag filter when status changes
  };

  const handleFlagFilterChange = (filter: FlagFilter) => {
    setFlagFilter(filter);
    setStatusFilter(null); // Clear status filter when flag changes
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setFlagFilter(null);
  };

  const getCurrentCases = () => {
    switch (activeTab) {
      case 'schedule': return allCases;
      case 'day-0': return day0Cases;
      case 'day-7': return day7Cases;
      case 'day-28': return day28Cases;
      default: return allCases;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10]">
      <Header />
      
      <main className="container py-6 md:py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white font-medium">CAWAO-Schedule</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Credit Account Investigation Portal
              </h1>
              <p className="text-slate-400">CAWAO-Schedule Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <FileUploadButton onDataLoaded={handleDataLoaded} />
              <Button asChild variant="outline" className="bg-[#181C23] text-white border-[#12151B] hover:bg-[#12151B]">
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Dashboard Overview
            </h2>
            {(statusFilter || flagFilter) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-[#4DA3FF] hover:text-white hover:bg-[#181C23]"
              >
                Clear Filters
              </Button>
            )}
          </div>
          <InvestigationStatsCards 
            stats={stats}
            onFilterChange={handleStatusFilterChange}
            activeFilter={statusFilter}
          />
        </div>

        {/* Flag Counts */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Flag Distribution
          </h2>
          <FlagCountCards 
            flags={flags}
            onFilterChange={handleFlagFilterChange}
            activeFilter={flagFilter}
          />
        </div>

        {/* Queue Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-[#181C23] border border-[#12151B]">
              <TabsTrigger 
                value="schedule" 
                className="text-slate-300 data-[state=active]:bg-[#4DA3FF] data-[state=active]:text-white gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Schedule
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-700 data-[state=active]:bg-white/20 text-slate-300">
                  {allCases.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="day-0" 
                className="text-slate-300 data-[state=active]:bg-[#4DA3FF] data-[state=active]:text-white gap-2"
              >
                <Clock className="h-4 w-4" />
                Day-0 Queue
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-700 data-[state=active]:bg-white/20 text-slate-300">
                  {day0Cases.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="day-7" 
                className="text-slate-300 data-[state=active]:bg-[#4DA3FF] data-[state=active]:text-white gap-2"
              >
                <Calendar className="h-4 w-4" />
                Day-7 Queue
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-700 data-[state=active]:bg-white/20 text-slate-300">
                  {day7Cases.length}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="day-28" 
                className="text-slate-300 data-[state=active]:bg-[#4DA3FF] data-[state=active]:text-white gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                Day-28 Queue
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-700 data-[state=active]:bg-white/20 text-slate-300">
                  {day28Cases.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="schedule" className="mt-0">
            <InvestigationTable 
              cases={allCases} 
              queue="day-0" 
              onMoveToDay7={handleMoveToDay7}
              statusFilter={statusFilter}
              flagFilter={flagFilter}
            />
          </TabsContent>

          <TabsContent value="day-0" className="mt-0">
            <InvestigationTable 
              cases={day0Cases} 
              queue="day-0" 
              onMoveToDay7={handleMoveToDay7}
              statusFilter={statusFilter}
              flagFilter={flagFilter}
            />
          </TabsContent>

          <TabsContent value="day-7" className="mt-0">
            <InvestigationTable 
              cases={day7Cases} 
              queue="day-7"
              statusFilter={statusFilter}
              flagFilter={flagFilter}
            />
          </TabsContent>

          <TabsContent value="day-28" className="mt-0">
            <InvestigationTable 
              cases={day28Cases} 
              queue="day-28"
              statusFilter={statusFilter}
              flagFilter={flagFilter}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CAWAODashboard;
