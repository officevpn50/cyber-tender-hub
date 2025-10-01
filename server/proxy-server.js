const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Simple in-memory cache
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Keywords for the tender search
const KEYWORDS = [
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
];

app.post('/api/tenders', async (req, res) => {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('✓ Returning cached data (age:', Math.floor((now - cacheTimestamp) / 1000), 'seconds)');
      return res.json({
        ...cachedData,
        cached: true,
        cacheAge: Math.floor((now - cacheTimestamp) / 1000)
      });
    }

    console.log('→ Cache miss - Fetching from backend API...');
    
    // Since backend is on same server, use localhost
    const response = await fetch('http://localhost:8000/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keywords: KEYWORDS,
        max_results: 50,
        strict_mode: true,
        loose_phrases: false
      })
    });

    if (!response.ok) {
      const errorMsg = `Backend API failed: ${response.status} ${response.statusText}`;
      console.error('✗', errorMsg);
      
      // If rate limited and we have cached data, return it even if stale
      if (response.status === 429 && cachedData) {
        console.log('⚠ Rate limited - returning stale cache');
        return res.json({
          ...cachedData,
          cached: true,
          stale: true,
          cacheAge: Math.floor((now - cacheTimestamp) / 1000)
        });
      }
      
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log(`✓ Successfully fetched ${data.results?.length || 0} tenders`);
    
    // Update cache
    cachedData = data;
    cacheTimestamp = Date.now();

    res.json({
      ...data,
      cached: false
    });
  } catch (error) {
    console.error('✗ Error:', error.message);
    
    // Return stale cache if available
    if (cachedData) {
      console.log('⚠ Error occurred - returning stale cache');
      return res.json({
        ...cachedData,
        cached: true,
        stale: true,
        error: error.message
      });
    }
    
    res.status(500).json({ 
      error: error.message,
      results: [] 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    cache: cachedData ? {
      age: Math.floor((Date.now() - cacheTimestamp) / 1000),
      items: cachedData.results?.length || 0
    } : null
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`📊 Cache duration: ${CACHE_DURATION / 1000} seconds`);
});
