import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TenderCard } from "@/components/TenderCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { Tender, TenderResponse } from "@/types/tender";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const fetchTenders = async (): Promise<TenderResponse> => {
  const response = await fetch("http://51.112.219.218:8000/scrape");
  if (!response.ok) {
    throw new Error("Failed to fetch tenders");
  }
  return response.json();
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["tenders"],
    queryFn: fetchTenders,
    refetchInterval: 60000, // Refresh every minute
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CyberTender Hub
              </h1>
              <p className="text-sm text-muted-foreground">
                Government Cybersecurity Procurement Portal
              </p>
            </div>
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
          <div className="bg-card rounded-lg p-6 shadow-md border border-border">
            <div className="text-2xl font-bold text-primary">{data?.results?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Total Tenders</div>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-md border border-border">
            <div className="text-2xl font-bold text-success">
              {data?.results?.filter((t) => t.status.toLowerCase() !== "sealed").length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Active Opportunities</div>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-md border border-border">
            <div className="text-2xl font-bold text-accent">{filteredTenders.length}</div>
            <div className="text-sm text-muted-foreground">Matching Filters</div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading tenders...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load tenders. Please check your connection and try again.
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Shield className="h-8 w-8 text-muted-foreground" />
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
      <footer className="border-t border-border bg-card mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>CyberTender Hub - Aggregating government cybersecurity procurement opportunities</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
