import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching tenders from external API...');
    
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
      console.error('API request failed:', response.status, response.statusText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.results?.length || 0} tenders`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching tenders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage, results: [] }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
