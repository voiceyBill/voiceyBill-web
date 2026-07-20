/**
 * WebMCP — Expose VoiceyBill tools to AI agents via the browser.
 * https://webmachinelearning.github.io/webmcp/
 */
(function () {
  if (!navigator.modelContext || !navigator.modelContext.provideContext) {
    return;
  }

  navigator.modelContext.provideContext({
    tools: [
      {
        name: "voiceybill_list_transactions",
        description:
          "List financial transactions with optional filters for type, category, date range, and search.",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["income", "expense"],
              description: "Filter by transaction type",
            },
            category: {
              type: "string",
              description: "Filter by category name",
            },
            startDate: {
              type: "string",
              format: "date",
              description: "Filter from date (ISO format)",
            },
            endDate: {
              type: "string",
              format: "date",
              description: "Filter to date (ISO format)",
            },
            search: {
              type: "string",
              description: "Search by description",
            },
            page: {
              type: "number",
              description: "Page number (default 1)",
            },
            limit: {
              type: "number",
              description: "Items per page (default 10)",
            },
          },
        },
        async execute(params) {
          const query = new URLSearchParams();
          Object.entries(params).forEach(([k, v]) => {
            if (v != null) query.set(k, String(v));
          });
          const token = localStorage.getItem("token");
          const res = await fetch(
            `https://voiceybill-server.vercel.app/api/transaction?${query}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return res.json();
        },
      },
      {
        name: "voiceybill_create_transaction",
        description:
          "Create a new income or expense transaction in VoiceyBill.",
        inputSchema: {
          type: "object",
          properties: {
            amount: { type: "number", description: "Transaction amount" },
            type: {
              type: "string",
              enum: ["income", "expense"],
              description: "Transaction type",
            },
            category: { type: "string", description: "Category name" },
            description: {
              type: "string",
              description: "Transaction description",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Transaction date (ISO format)",
            },
          },
          required: ["amount", "type", "category", "description"],
        },
        async execute(params) {
          const token = localStorage.getItem("token");
          const res = await fetch(
            "https://voiceybill-server.vercel.app/api/transaction",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(params),
            }
          );
          return res.json();
        },
      },
      {
        name: "voiceybill_get_analytics",
        description:
          "Get financial analytics and spending insights including category breakdowns and trends.",
        inputSchema: {
          type: "object",
          properties: {
            period: {
              type: "string",
              enum: ["week", "month", "year"],
              description: "Analytics period",
            },
          },
        },
        async execute(params) {
          const token = localStorage.getItem("token");
          const query = params.period ? `?period=${params.period}` : "";
          const res = await fetch(
            `https://voiceybill-server.vercel.app/api/analytics${query}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return res.json();
        },
      },
      {
        name: "voiceybill_get_budgets",
        description:
          "Get all budget categories with current spending and limits.",
        inputSchema: { type: "object", properties: {} },
        async execute() {
          const token = localStorage.getItem("token");
          const res = await fetch(
            "https://voiceybill-server.vercel.app/api/budget",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return res.json();
        },
      },
    ],
  });
})();
