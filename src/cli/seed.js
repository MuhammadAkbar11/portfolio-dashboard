import readline from "readline";
import { execSync } from "child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function runSeed() {
  console.log("--- Seed CLI ---");
  console.log("1. development");
  console.log("2. production");
  
  const envChoice = await question("Select environment (1 or 2): ");
  const environment = envChoice === "2" ? "production" : "development";

  console.log("\nAction:");
  console.log("1. Import Data");
  console.log("2. Destroy Data");
  const actionChoice = await question("Select action (1 or 2): ");
  const action = actionChoice === "2" ? "destroy" : "import";

  rl.close();

  console.log(`\n🚀 Starting seed: ${action} for ${environment} environment...\n`);

  const env = { ...process.env, NODE_ENV: environment };

  try {
    execSync(`node src/seeds/index.js seed=${action}`, {
      env,
      stdio: "inherit",
    });
  } catch (error) {
    console.error(`\n❌ Seed ${action} failed.`);
    process.exit(1);
  }
}

runSeed();
