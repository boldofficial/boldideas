
'use server'
import { seedDemoProject } from "@/actions/projects";

// This component runs on the server and auto-seeds on first load
export default async function DemoSeeder() {
  await seedDemoProject();
  return null; // Renders nothing
}
