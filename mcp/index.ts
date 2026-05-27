import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { crmTools, projectTools, taskTools, financeTools, communicationTools } from './tools.js';
import { resourceHandlers, handleResourceTemplate } from './resources.js';
import { runAllChecks, generateWeeklySummary, checkStaleLeads, checkOverdueTasks, checkOverdueInvoices } from './agent.js';
import cron from 'node-cron';

// ─── Create Server ─────────────────────────────────────

const server = new McpServer(
  {
    name: 'bold-ideas-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// ─── Register CRM Tools ────────────────────────────────

for (const tool of crmTools) {
  server.registerTool(tool.name, {
    title: tool.name,
    description: tool.config.description,
    inputSchema: tool.config.inputSchema,
  }, tool.handler as any);
}

// ─── Register Project Tools ────────────────────────────

for (const tool of projectTools) {
  server.registerTool(tool.name, {
    description: tool.config.description,
    inputSchema: tool.config.inputSchema,
  }, tool.handler as any);
}

// ─── Register Task Tools ───────────────────────────────

for (const tool of taskTools) {
  server.registerTool(tool.name, {
    description: tool.config.description,
    inputSchema: tool.config.inputSchema,
  }, tool.handler as any);
}

// ─── Register Finance Tools ────────────────────────────

for (const tool of financeTools) {
  server.registerTool(tool.name, {
    description: tool.config.description,
    inputSchema: tool.config.inputSchema,
  }, tool.handler as any);
}

// ─── Register Communication Tools ──────────────────────

for (const tool of communicationTools) {
  server.registerTool(tool.name, {
    description: tool.config.description,
    inputSchema: tool.config.inputSchema,
  }, tool.handler as any);
}

// ─── AI Agent Tools ────────────────────────────────────

server.registerTool('agent_run_all_checks', {
  description: 'Run all automated AI agent checks: stale leads, overdue tasks, overdue invoices',
  inputSchema: z.object({}),
}, async () => {
  const results = await runAllChecks();
  return { content: [{ type: 'text' as const, text: results.join('\n') }] };
});

server.registerTool('agent_check_stale_leads', {
  description: 'Check for stale leads (no update in 7+ days) and create follow-up tasks',
  inputSchema: z.object({}),
}, async () => {
  const results = await checkStaleLeads();
  return { content: [{ type: 'text' as const, text: results.join('\n') || 'No stale leads found.' }] };
});

server.registerTool('agent_check_overdue_tasks', {
  description: 'Check for overdue tasks and send reminder notifications to assignees',
  inputSchema: z.object({}),
}, async () => {
  const results = await checkOverdueTasks();
  return { content: [{ type: 'text' as const, text: results.join('\n') || 'No overdue tasks found.' }] };
});

server.registerTool('agent_check_overdue_invoices', {
  description: 'Check for overdue invoices and auto-mark them as overdue',
  inputSchema: z.object({}),
}, async () => {
  const results = await checkOverdueInvoices();
  return { content: [{ type: 'text' as const, text: results.join('\n') || 'No overdue invoices found.' }] };
});

server.registerTool('agent_weekly_summary', {
  description: 'Generate a weekly summary report of leads, tasks, revenue, and activity',
  inputSchema: z.object({}),
}, async () => {
  const summary = await generateWeeklySummary();
  return { content: [{ type: 'text' as const, text: summary }] };
});

// ─── Register Resources ────────────────────────────────

for (const [uri, handler] of Object.entries(resourceHandlers)) {
  const name = uri.replace('bold://', '');
  server.registerResource(
    name,
    uri,
    { description: `Bold Ideas ${name} data` },
    async (url) => {
      const result = await handler(url);
      return result as any; // Cast to match SDK's expected ReadResourceResult
    }
  );
}

// Register resource template for dynamic resources (bold://leads/{id}, etc.)
server.registerResource(
  'item',
  new ResourceTemplate('bold://{type}/{id}', {
    list: async () => ({ resources: [] }),
  }),
  { description: 'Access individual records by type and ID' },
  async (uri, variables) => {
    const result = await handleResourceTemplate(uri, variables as { type?: string; id?: string });
    return result as any;
  }
);

// ─── Start Server ──────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('✅ Bold Ideas MCP Server running on stdio');
  console.error('Available tools:');
  console.error(`  ${[
    ...crmTools.map(t => t.name),
    ...projectTools.map(t => t.name),
    ...taskTools.map(t => t.name),
    ...financeTools.map(t => t.name),
    ...communicationTools.map(t => t.name),
    'agent_run_all_checks',
    'agent_check_stale_leads',
    'agent_check_overdue_tasks',
    'agent_check_overdue_invoices',
    'agent_weekly_summary',
  ].join(', ')}`);
  console.error('Available resources:');
  console.error(`  ${Object.keys(resourceHandlers).join(', ')}, bold://{type}/{id}`);
}

// ─── Schedule AI Agent ──────────────────────────

// Run stale lead check every day at 9:00 AM
cron.schedule('0 9 * * *', () => {
  checkStaleLeads().catch(err => console.error('[Scheduler] stale leads error:', err));
});

// Run overdue task check every day at 10:00 AM
cron.schedule('0 10 * * *', () => {
  checkOverdueTasks().catch(err => console.error('[Scheduler] overdue tasks error:', err));
});

// Run overdue invoice check every day at 11:00 AM
cron.schedule('0 11 * * *', () => {
  checkOverdueInvoices().catch(err => console.error('[Scheduler] overdue invoices error:', err));
});

console.error('AI Agent scheduler running (daily checks at 9AM, 10AM, 11AM)');

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
