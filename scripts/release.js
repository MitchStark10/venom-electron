
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(__dirname, "..", "package.json");

const exec = (command) => {
  try {
    console.log(`Executing: ${command}`);
    return execSync(command, { stdio: "inherit" });
  } catch (e) {
    console.error(`Failed to execute: ${command}`);
    console.error(e);
    process.exit(1);
  }
};

const main = () => {
  // 1. Read package.json and increment version
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const currentVersion = packageJson.version;
  const versionParts = currentVersion.split(".").map(Number);
  versionParts[2]++;
  const newVersion = versionParts.join(".");
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`Updated version from ${currentVersion} to ${newVersion}`);

  // 2. Build for all platforms
  exec("yarn electron:package");

  // 3. Git commit, tag, and push
  exec(`git add package.json`);
  exec(`git commit -m "chore(release): v${newVersion}"`);
  exec(`git tag v${newVersion}`);
  exec(`git push`);
  exec(`git push --tags`);
  console.log(`Committed, tagged, and pushed version ${newVersion}`);

  // 4. Create GitHub release
  exec(`gh release create v${newVersion} --title "v${newVersion}" --notes "Release v${newVersion}"`);
  console.log(`Created GitHub release v${newVersion}`);

  // 5. Upload assets
  const artifacts = fs
    .readdirSync("dist")
    .filter(
      (file) =>
        file.endsWith(".dmg") || file.endsWith(".exe") || file.endsWith(".deb")
    )
    .map((file) => `"dist/${file}"`);

  if (artifacts.length === 0) {
    console.error("No release artifacts found in dist/");
    process.exit(1);
  }

  exec(`gh release upload v${newVersion} ${artifacts.join(" ")}`);
  console.log(`Uploaded artifacts to GitHub release`);
  
  console.log("Release process completed successfully!");
};

main();
