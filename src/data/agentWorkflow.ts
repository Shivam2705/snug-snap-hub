export interface AgentStep {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'failed';
  description: string;
  actions: string[];
  findings?: string[];
  timestamp?: string;
}

export interface AgentWorkflow {
  caseId: string;
  agents: AgentStep[];
}

export const getAgentWorkflow = (caseId: string): AgentWorkflow => {
  // Simulate different workflow states based on case
  const baseWorkflow: AgentStep[] = [
    {
      id: "customer-verification",
      name: "Customer Verification Agent",
      status: "completed",
      description: "Verifies if the case was previously worked and checks for multiple customer matches in iGuide Mainframe",
      actions: [
        "Read notes from iGuide Mainframe",
        "Search by address in iGuide",
        "Search by phone number in iGuide",
        "Check for related/spouse/same person matches"
      ],
      findings: [
        "Single customer match found in iGuide",
        "No previous investigator notes found",
        "Proceeding to next verification step"
      ],
      timestamp: "2024-01-15T09:35:00"
    },
    {
      id: "address-verification",
      name: "Address Verification Agent",
      status: "in-progress",
      description: "Verifies address details through Transunion and Experian credit bureaus",
      actions: [
        "Read Transunion reference ID from iGuide notes",
        "Read Experian reference ID from iGuide notes",
        "Fetch address from Transunion portal",
        "Fetch address from Experian portal",
        "Compare addresses for discrepancies",
        "Calculate fraud probability score"
      ],
      findings: [
        "Transunion ID: TU-789456123",
        "Experian ID: EX-321654987",
        "Address match: 95% confidence"
      ],
      timestamp: "2024-01-15T09:45:00"
    },
    {
      id: "email-agent",
      name: "Email Agent",
      status: "pending",
      description: "Sends customer communications via Zendesk ticketing system",
      actions: [
        "Create Zendesk ticket",
        "Send verification email to customer",
        "Update Zendesk notes with communication log"
      ]
    },
    {
      id: "messaging-agent",
      name: "Messaging Agent",
      status: "pending",
      description: "Sends SMS communications via iGuide portal",
      actions: [
        "Send text message via iGuide portal",
        "Update Zendesk notes with SMS log"
      ]
    },
    {
      id: "fraud-detection",
      name: "Fraud Detection Agent",
      status: "pending",
      description: "Checks CIFAS National Fraud Database for fraud markers",
      actions: [
        "Access CIFAS portal (find.cifas.org.uk)",
        "Search for customer in fraud database",
        "Review case type and expand Person Summary",
        "Compare CIFAS details with account details",
        "Determine fraud status based on case type"
      ]
    }
  ];

  // Modify workflow based on case status
  if (caseId === "CAW-2024-001" || caseId === "CAW-2024-007") {
    return {
      caseId,
      agents: baseWorkflow.map(agent => ({
        ...agent,
        status: "completed" as const,
        findings: agent.findings || ["Verification completed successfully"]
      }))
    };
  }

  return { caseId, agents: baseWorkflow };
};

export const creditInvestigationAgents = [
  {
    id: "customer-verification",
    name: "Customer Verification Agent",
    purpose: "Identify if the case was previously worked and check for multiple customer matches in iGuide Mainframe to detect potential fraud.",
    capabilities: [
      "Read notes from iGuide Mainframe to check previous investigator work",
      "Search by address in iGuide Mainframe",
      "Search by phone number in iGuide Mainframe",
      "Identify if multiple customers are related, spouse, or same person",
      "Mark account as Fraud if multiple unrelated customers found",
      "Escalate case to ACT (Accounts Investigation Team) via email"
    ],
    businessValue: [
      "Early fraud detection through duplicate account identification",
      "Reduces manual investigation time",
      "Ensures consistent verification process"
    ],
    savings: [
      "40-60% reduction in investigation time",
      "25-35% improvement in fraud detection rate"
    ],
    sampleInputs: [
      { label: "Customer Name", type: "text", placeholder: "John Doe" },
      { label: "Phone Number", type: "text", placeholder: "+44 7123 456789" },
      { label: "Address", type: "text", placeholder: "123 High Street, London" }
    ]
  },
  {
    id: "address-verification",
    name: "Address Verification Agent",
    purpose: "Verify address details through Transunion and Experian credit bureaus and identify discrepancies.",
    capabilities: [
      "Read Transunion reference ID from iGuide notes",
      "Read Experian reference ID from iGuide notes",
      "Fetch address and birth date from Transunion portal",
      "Fetch address and birth date from Experian portal",
      "Compare addresses for discrepancies",
      "Calculate fraud probability score",
      "Trigger Email Agent if probability > 95%"
    ],
    businessValue: [
      "Cross-reference verification with credit bureaus",
      "Automated discrepancy detection",
      "Probability-based fraud scoring"
    ],
    savings: [
      "50-70% reduction in manual address checks",
      "30-40% improvement in discrepancy detection"
    ],
    sampleInputs: [
      { label: "Transunion Reference ID", type: "text", placeholder: "TU-789456123" },
      { label: "Experian Reference ID", type: "text", placeholder: "EX-321654987" },
      { label: "Customer Address", type: "text", placeholder: "123 High Street, London" },
      { label: "Date of Birth", type: "date", placeholder: "1990-01-15" }
    ]
  },
  {
    id: "email-agent",
    name: "Email Agent",
    purpose: "Send customer communications via Zendesk ticketing system for verification and follow-up.",
    capabilities: [
      "Create Zendesk ticket for customer communication",
      "Send verification email to customer",
      "Update Zendesk notes with communication log",
      "Track email delivery and response status"
    ],
    businessValue: [
      "Automated customer communication",
      "Centralized ticket management",
      "Complete audit trail of communications"
    ],
    savings: [
      "60-80% reduction in manual email handling",
      "Improved response tracking"
    ],
    sampleInputs: [
      { label: "Customer Email", type: "email", placeholder: "customer@email.com" },
      { label: "Subject", type: "text", placeholder: "Account Verification Required" },
      { label: "Message Template", type: "select", options: ["Verification Request", "Follow-up", "Confirmation"] }
    ]
  },
  {
    id: "messaging-agent",
    name: "Messaging Agent",
    purpose: "Send SMS communications via iGuide portal and maintain records in Zendesk.",
    capabilities: [
      "Send text message via iGuide portal",
      "Update Zendesk notes with SMS log",
      "Track message delivery status",
      "Handle automated responses"
    ],
    businessValue: [
      "Multi-channel customer engagement",
      "Faster customer response rates",
      "Unified communication tracking"
    ],
    savings: [
      "70-85% improvement in customer response time",
      "Reduced operational overhead"
    ],
    sampleInputs: [
      { label: "Mobile Number", type: "text", placeholder: "+44 7123 456789" },
      { label: "Message Template", type: "select", options: ["Verification Code", "Account Alert", "Follow-up"] }
    ]
  },
  {
    id: "fraud-detection",
    name: "Fraud Detection Agent",
    purpose: "Check CIFAS National Fraud Database for fraud markers and determine case status based on case type.",
    capabilities: [
      "Access CIFAS portal (find.cifas.org.uk)",
      "Search for customer in National Fraud Database",
      "Handle IDENTITY FRAUD (02) case type",
      "Handle PROTECTIVE REGISTRATION (98/99) case types",
      "Skip MISUSE OF FACILITY (06) and FALSE APPLICATION cases",
      "Compare CIFAS details with account details"
    ],
    businessValue: [
      "Direct integration with national fraud database",
      "Standardized fraud case handling",
      "Comprehensive fraud type coverage"
    ],
    savings: [
      "45-55% reduction in fraud investigation time",
      "90%+ accuracy in fraud detection"
    ],
    sampleInputs: [
      { label: "Customer Name", type: "text", placeholder: "John Doe" },
      { label: "Date of Birth", type: "date", placeholder: "1990-01-15" },
      { label: "Email Address", type: "email", placeholder: "customer@email.com" },
      { label: "Address", type: "text", placeholder: "123 High Street, London" },
      { label: "Case Type", type: "select", options: ["IDENTITY FRAUD (02)", "PROTECTIVE REGISTRATION (98)", "PROTECTIVE REGISTRATION & VICTIM (99)"] }
    ]
  }
];

export const marketingAgents = [
  {
    id: "customer-360",
    name: "Customer 360° Intelligence Agent",
    purpose: "Create a unified, continuously refreshed customer profile to serve as the foundation for all personalization and marketing decisions.",
    capabilities: [
      "Consolidates data from online and in-store purchase history",
      "Tracks cart and wishlist behavior",
      "Monitors monthly spend and average order value",
      "Analyzes click-through rate (CTR) and browsing depth",
      "Records store visits and offline transactions",
      "Maintains demographic attributes (age band, household type, region)",
      "Builds dynamic micro-segments rather than static personas",
      "Updates profiles in near real time"
    ],
    businessValue: [
      "Single source of truth for personalization",
      "Eliminates fragmented targeting across channels"
    ],
    savings: [
      "10–15% reduction in wasted marketing spend",
      "5–8% uplift in campaign relevance and response rates"
    ]
  },
  {
    id: "apparel-recommendation",
    name: "Hyper-Personalized Apparel Recommendation Agent",
    purpose: "Deliver highly tailored apparel recommendations at SKU, size, color, and style level for each customer.",
    capabilities: [
      "Style affinity modeling (formal, casual, seasonal, occasion-based)",
      "Size and fit intelligence using return and exchange history",
      "Context-aware recommendations (weather, season, events)",
      "Outfit and bundle creation across categories"
    ],
    businessValue: [
      "Differentiated, fashion-first personalization",
      "Improved customer confidence and purchase intent"
    ],
    savings: [
      "8–12% increase in Average Order Value (AOV)",
      "6–10% uplift in conversion rates",
      "10–15% reduction in size-related returns"
    ]
  },
  {
    id: "spend-affordability",
    name: "Spend Affordability & Price Sensitivity Agent",
    purpose: "Align product and offer recommendations with each customer's spending comfort and price sensitivity.",
    capabilities: [
      "Analyzes monthly expense patterns and purchase cadence",
      "Detects discount sensitivity and full-price tolerance",
      "Optimizes recommendations between full-price items, bundles, and promotions",
      "Determines optimal timing for offers"
    ],
    businessValue: [
      "Prevents over-discounting",
      "Protects margins while improving conversion"
    ],
    savings: [
      "5–8% margin protection",
      "7–12% improvement in offer conversion rates",
      "Reduced promotion leakage"
    ]
  },
  {
    id: "omnichannel-orchestration",
    name: "Omnichannel Behavior Orchestration Agent",
    purpose: "Deliver consistent and personalized customer journeys across digital and physical channels.",
    capabilities: [
      "Identifies preferred engagement channel per customer",
      "Orchestrates personalization across web, app, email, push, and store",
      "Enables online browse to in-store try-on recommendations",
      "Triggers personalized digital follow-up after store visits"
    ],
    businessValue: [
      "Seamless omnichannel experience",
      "Increased engagement and satisfaction"
    ],
    savings: [
      "10–15% uplift in omnichannel engagement",
      "5–7% increase in repeat purchase frequency"
    ]
  },
  {
    id: "next-best-product",
    name: "Predictive Next-Best-Product Agent",
    purpose: "Anticipate what a customer is most likely to buy next and proactively recommend it.",
    capabilities: [
      "Learns purchase cycles and replenishment behavior",
      "Predicts upcoming needs (seasonal refresh, workwear, occasion wear)",
      "Triggers proactive recommendations and reminders"
    ],
    businessValue: [
      "Shifts marketing from reactive to anticipatory",
      "Drives higher customer lifetime value"
    ],
    savings: [
      "8–12% increase in repeat sales",
      "10–20% improvement in email and push CTR"
    ]
  },
  {
    id: "campaign-personalization",
    name: "Campaign Personalization & Creative Optimization Agent",
    purpose: "Personalize not only products, but also creative assets, messaging, and timing.",
    capabilities: [
      "Selects optimal creative variant per customer",
      "Optimizes subject lines, imagery, tone, and frequency",
      "Determines best send time using engagement history",
      "Continuously learns from CTR and interaction signals"
    ],
    businessValue: [
      "Higher ROI from existing marketing spend",
      "Reduced customer fatigue and opt-outs"
    ],
    savings: [
      "15–25% improvement in CTR",
      "10–20% reduction in unsubscribes and opt-outs"
    ]
  },
  {
    id: "loyalty-lifecycle",
    name: "Loyalty & Lifecycle Personalization Agent",
    purpose: "Personalize offers and experiences based on customer lifecycle stage and loyalty value.",
    capabilities: [
      "Identifies lifecycle stage (new, active, at-risk, dormant)",
      "Customizes loyalty rewards, early access, and exclusive offers",
      "Designs targeted win-back and retention campaigns"
    ],
    businessValue: [
      "Improved retention and loyalty stickiness",
      "Maximized lifetime revenue"
    ],
    savings: [
      "15–20% improvement in retention rates",
      "10–15% increase in loyalty program engagement"
    ]
  }
];

export const financeAgents = [
  {
    id: "invoice-processing",
    name: "Invoice Processing & Reconciliation Agent",
    purpose: "Automate supplier invoice intake, validation, and reconciliation.",
    capabilities: [
      "OCR + semantic extraction from invoices",
      "3-way match (PO, GRN, Invoice)",
      "Exception identification and auto-resolution",
      "Automated AP workflow processing"
    ],
    businessValue: [
      "60–80% reduction in manual AP effort",
      "Faster supplier payments, fewer disputes"
    ],
    savings: [
      "60–80% reduction in manual AP effort",
      "Faster supplier payments"
    ],
    sampleInputs: [
      { label: "Invoice Number", type: "text", placeholder: "INV-2024-001234" },
      { label: "Supplier Name", type: "text", placeholder: "Acme Supplies Ltd" },
      { label: "Invoice Amount", type: "text", placeholder: "£15,450.00" },
      { label: "PO Number", type: "text", placeholder: "PO-2024-5678" }
    ]
  },
  {
    id: "revenue-recognition",
    name: "Revenue Recognition & Reconciliation Agent",
    purpose: "Ensure accurate, compliant revenue accounting across channels.",
    capabilities: [
      "Online vs store sales reconciliation",
      "Returns and refunds accounting",
      "Gift card and credit accounting",
      "Multi-channel revenue tracking"
    ],
    businessValue: [
      "Reduced month-end close cycles",
      "Lower audit risk"
    ],
    savings: [
      "30-50% faster month-end close",
      "Reduced audit risk"
    ],
    sampleInputs: [
      { label: "Revenue Period", type: "select", options: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"] },
      { label: "Channel", type: "select", options: ["Online", "In-Store", "All Channels"] },
      { label: "Transaction Date", type: "date", placeholder: "2024-01-15" }
    ]
  },
  {
    id: "margin-leakage",
    name: "Margin Leakage & Cost Anomaly Detection Agent",
    purpose: "Identify hidden profit erosion across the value chain.",
    capabilities: [
      "Detect abnormal discounting patterns",
      "Identify excess logistics or fulfilment costs",
      "Flag unusual return or write-off spikes",
      "Cost variance analysis"
    ],
    businessValue: [
      "2–4% margin protection",
      "Early corrective action"
    ],
    savings: [
      "2–4% margin protection",
      "Early corrective action"
    ],
    sampleInputs: [
      { label: "Analysis Period", type: "select", options: ["Last 7 Days", "Last 30 Days", "Last Quarter"] },
      { label: "Cost Category", type: "select", options: ["Discounting", "Logistics", "Returns", "All Categories"] },
      { label: "Threshold (%)", type: "text", placeholder: "5" }
    ]
  }
];

export const merchandisingAgents = [
  {
    id: "demand-forecasting",
    name: "Demand Forecasting & Replenishment Agent",
    purpose: "Improve SKU-level demand planning across regions and channels.",
    capabilities: [
      "SKU/store/channel demand forecasting",
      "Seasonal and trend-driven adjustments",
      "Automated replenishment triggers",
      "Multi-location inventory optimization"
    ],
    businessValue: [
      "10–20% inventory holding cost reduction",
      "Fewer stock-outs and markdowns"
    ],
    savings: [
      "10–20% inventory cost reduction",
      "Fewer stock-outs"
    ],
    sampleInputs: [
      { label: "SKU", type: "text", placeholder: "SKU-12345" },
      { label: "Region", type: "select", options: ["North", "South", "East", "West", "All Regions"] },
      { label: "Forecast Horizon", type: "select", options: ["7 Days", "30 Days", "90 Days"] }
    ]
  },
  {
    id: "assortment-optimization",
    name: "Assortment & Range Optimization Agent",
    purpose: "Optimize product mix at store and regional level.",
    capabilities: [
      "Identify underperforming SKUs",
      "Localized assortment recommendations",
      "New product success prediction",
      "Category performance analysis"
    ],
    businessValue: [
      "Higher sell-through rates",
      "Reduced dead stock"
    ],
    savings: [
      "15–25% higher sell-through",
      "Reduced dead stock"
    ],
    sampleInputs: [
      { label: "Store/Region", type: "select", options: ["All Stores", "Flagship Stores", "Regional", "Online"] },
      { label: "Category", type: "select", options: ["Apparel", "Footwear", "Accessories", "All Categories"] },
      { label: "Analysis Type", type: "select", options: ["Underperformers", "Top Sellers", "New Products"] }
    ]
  },
  {
    id: "supplier-performance",
    name: "Supplier Performance Intelligence Agent",
    purpose: "Continuously evaluate supplier reliability and quality.",
    capabilities: [
      "On-time delivery tracking",
      "Quality issue pattern detection",
      "Cost vs performance scoring",
      "Supplier risk assessment"
    ],
    businessValue: [
      "Better supplier negotiations",
      "Reduced operational disruptions"
    ],
    savings: [
      "5–10% better supplier terms",
      "Reduced disruptions"
    ],
    sampleInputs: [
      { label: "Supplier Name", type: "text", placeholder: "Global Textiles Inc" },
      { label: "Evaluation Period", type: "select", options: ["Last Month", "Last Quarter", "Last Year"] },
      { label: "Metric Focus", type: "select", options: ["Delivery", "Quality", "Cost", "All Metrics"] }
    ]
  }
];