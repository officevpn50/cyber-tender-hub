import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TenderCard } from "@/components/TenderCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { Cyber50Logo } from "@/components/Cyber50Logo";
import { Tender, TenderResponse } from "@/types/tender";
import { Loader2, AlertCircle, TrendingUp, Clock, Target } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const fetchTenders = async (): Promise<TenderResponse> => {
  const response = await fetch("http://51.112.219.218:8000/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keywords: [
        "Cybersecurity", "Security", "Information Security", "Network Security", "Data Protection",
        "Cyber Threat", "Incident Response", "Penetration Testing", "Vulnerability Assessment", "RFP",
        "IT Security", "Endpoint Security", "Firewall", "Intrusion Detection", "Intrusion Prevention",
        "SIEM", "SOC", "Malware Analysis", "Threat Intelligence", "Phishing", "Ransomware",
        "Cloud Security", "Application Security", "Web Security", "Zero Trust", "Identity Management",
        "Access Control", "Encryption", "Data Loss Prevention", "Security Audit", "ISO 27001",
        "NIST", "CIS Controls", "Cyber Defense", "Red Team", "Blue Team", "Security Operations",
        "Vulnerability Management", "Security Policy", "Security Governance", "Cyber Risk",
        "Cyber Resilience", "Security Monitoring", "Threat Hunting", "Digital Forensics",
        "SOC-as-a-Service", "MDR", "Cloud Compliance", "Security Awareness Training",
        "Endpoint Detection", "Application Firewall", "SIEM Integration", "Patch Management",
        "أمن سيبراني", "الأمن المعلوماتي", "حماية البيانات", "الهجمات السيبرانية",
        "الاستجابة للحوادث", "اختبار الاختراق", "تقييم الثغرات", "حماية الشبكات",
        "سياسة الأمان", "حوكمة أمن المعلومات", "تدقيق أمني", "الامتثال الأمني",
        "الوعي الأمني", "تشخيص البرمجيات الخبيثة", "الهندسة العكسية", "تحليل التهديدات",
        "إدارة الهوية", "التحكم بالوصول", "تشفير البيانات", "خدمات الأمن السحابي",
        "إدارة المخاطر السيبرانية", "الاختبارات الأمنية", "الحماية من الفيروسات", "الجرائم الإلكترونية"
      ],
      max_results: 50,
      strict_mode: true,
      loose_phrases: false
    })
  });
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
