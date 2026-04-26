import readline from "readline";
import { execSync } from "child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function runMigrate() {
  console.log("--- Migration CLI ---");
  console.log("1. development");
  console.log("2. production");
  
  const envChoice = await question("Select environment (1 or 2): ");
  const environment = envChoice === "2" ? "production" : "development";

  rl.close();

  console.log(`\n🚀 Running migrations in ${environment} environment...\n`);

  const env = { ...process.env, NODE_ENV: environment };

  try {
    execSync(`node src/migrations/index.js up`, {
      env,
      stdio: "inherit",
    });
  } catch (error) {
    console.error(`\n❌ Migration failed.`);
    process.exit(1);
  }
}

runMigrate();
