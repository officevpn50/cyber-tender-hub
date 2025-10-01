import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TenderCard } from "@/components/TenderCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { Cyber50Logo } from "@/components/Cyber50Logo";
import { Tender, TenderResponse } from "@/types/tender";
import { Loader2, AlertCircle, TrendingUp, Clock, Target } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const fetchTenders = async (): Promise<TenderResponse> => {
  // For production, use your EC2 proxy endpoint
  // For development with Lovable Cloud, use supabase function
  const isProduction = window.location.hostname !== 'localhost' && 
                       !window.location.hostname.includes('lovable.app');
  
  if (isProduction) {
    // EC2 proxy endpoint (adjust URL as needed)
    const response = await fetch('/api/tenders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch tenders");
    }
    
    return response.json();
  } else {
    // Lovable Cloud backend
    const { data, error } = await supabase.functions.invoke('fetch-tenders');
    
    if (error) {
      throw new Error(error.message || "Failed to fetch tenders");
    }
    
    return data;
  }
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["tenders"],
    queryFn: fetchTenders,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes to avoid rate limits
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
  });

  const filteredTenders = data?.results?.filter((tender: Tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.contact.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || tender.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }) || [];

  const activeTenders = data?.results?.filter((t) => t.status.toLowerCase() !== "sealed").length || 0;

  return (
    <div className="min-h-screen cyber-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <Cyber50Logo />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <FilterBar statusFilter={statusFilter} onStatusChange={setStatusFilter} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {data?.results?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Total Tenders</div>
          </div>

          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
            <div className="text-3xl font-bold text-success">
              {activeTenders}
            </div>
            <div className="text-sm text-muted-foreground">Active Opportunities</div>
          </div>

          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <Clock className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              {filteredTenders.length}
            </div>
            <div className="text-sm text-muted-foreground">Matching Filters</div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-50">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                </div>
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4 relative" />
              </div>
              <p className="text-muted-foreground">Scanning government portals...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8 bg-destructive/10 border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error && error.message.includes('429') 
                ? 'The tender API is rate limited. Showing cached data or try again in a few minutes.'
                : 'Failed to load tenders. Please check your connection and try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Tenders Grid */}
        {!isLoading && !error && (
          <>
            {filteredTenders.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTenders.map((tender: Tender) => (
                  <TenderCard key={tender.number} tender={tender} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-4 glow-primary">
                  <Target className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No tenders found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            <span className="font-semibold bg-gradient-primary bg-clip-text text-transparent">
              CYBER50 DEFENSE
            </span>{" "}
            Tender Intelligence Platform - Your Guardian in Government Procurement
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
