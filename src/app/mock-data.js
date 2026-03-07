export const customerOverview = {
  metrics: [
    {
      label: "Active balance",
      value: "$18,420",
      detail: "Across 2 financed vehicles",
    },
    {
      label: "Next payment",
      value: "$486",
      detail: "Due March 21, 2026",
    },
    {
      label: "Open invoices",
      value: "3",
      detail: "1 needs manual review",
    },
  ],
  recentInvoices: [
    {
      id: "INV-4021",
      vehicle: "2021 Toyota Highlander",
      dueDate: "2026-03-21",
      status: "Scheduled",
      amount: "$486",
    },
    {
      id: "INV-3988",
      vehicle: "2019 Honda Accord",
      dueDate: "2026-03-14",
      status: "Pending",
      amount: "$312",
    },
    {
      id: "INV-3954",
      vehicle: "2021 Toyota Highlander",
      dueDate: "2026-02-21",
      status: "Paid",
      amount: "$486",
    },
  ],
  timeline: [
    {
      title: "ACH payment posted",
      detail: "Invoice INV-3954 settled successfully.",
      time: "2 days ago",
    },
    {
      title: "Insurance documentation refreshed",
      detail: "Coverage proof synced to the servicing record.",
      time: "5 days ago",
    },
    {
      title: "Manual review requested",
      detail: "Customer support flagged fee adjustment on INV-3988.",
      time: "7 days ago",
    },
  ],
  paymentMethods: [
    {
      method: "Primary checking",
      descriptor: "ACH ending in 1408",
      status: "Verified",
    },
    {
      method: "Backup Visa",
      descriptor: "Card ending in 2094",
      status: "On file",
    },
  ],
};

export const adminOverview = {
  metrics: [
    {
      label: "Portfolio serviced",
      value: "$3.84M",
      detail: "124 active finance contracts",
    },
    {
      label: "Delinquent accounts",
      value: "9",
      detail: "3 escalated this week",
    },
    {
      label: "Leads awaiting review",
      value: "14",
      detail: "5 new in the last 24 hours",
    },
    {
      label: "Unsent invoices",
      value: "6",
      detail: "Drafts pending Stripe sync",
    },
  ],
  customers: [
    {
      name: "Sonia Patel",
      segment: "Returning buyer",
      balance: "$11,900",
      health: "Current",
    },
    {
      name: "Marcus Hughes",
      segment: "Extension requested",
      balance: "$7,440",
      health: "Review",
    },
    {
      name: "Erica Jimenez",
      segment: "Co-applicant",
      balance: "$19,020",
      health: "Delinquent",
    },
  ],
  leads: [
    {
      applicant: "Avery Nguyen",
      source: "Dealer website",
      stage: "Docs pending",
      requested: "$22,000",
    },
    {
      applicant: "Christian Boone",
      source: "Referral",
      stage: "Prequalified",
      requested: "$17,500",
    },
    {
      applicant: "Maya Torres",
      source: "Walk-in",
      stage: "Manual underwriting",
      requested: "$28,300",
    },
  ],
  invoices: [
    {
      invoice: "INV-4021",
      customer: "Sonia Patel",
      amount: "$486",
      status: "Queued",
    },
    {
      invoice: "INV-4017",
      customer: "Marcus Hughes",
      amount: "$312",
      status: "Needs approval",
    },
    {
      invoice: "INV-3999",
      customer: "Erica Jimenez",
      amount: "$598",
      status: "Paid",
    },
  ],
  staff: [
    {
      person: "Dana Holloway",
      role: "Collections lead",
      status: "On shift",
    },
    {
      person: "Jordan Cobb",
      role: "Underwriting",
      status: "Review queue",
    },
    {
      person: "Mina Park",
      role: "Billing ops",
      status: "Reconciling",
    },
  ],
};
