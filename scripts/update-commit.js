const pkg = require("../package.json");
const pkgVersionRegex = /^(\d+\.\d+\.\d+)(?:-alpha\.(.{7}))?/;

function printIntegratedVersion(
  baseBranchName,
  triggerCommitHash,
  developCommitHash
) {
  const [, prodVersion, baseCommitHash = developCommitHash] =
    pkgVersionRegex.exec(pkg.version);

  let intVersion;
  if (baseBranchName === "main") {
    // merge into main branch
    intVersion = prodVersion; // e.g. 1.2.3
  } else if (baseBranchName === "develop") {
    // merge into develop branch
    intVersion = `${prodVersion}-alpha.${triggerCommitHash.slice(0, 7)}`; // e.g. 1.2.3-alpha.1234567
  } else {
    // merge into other branches
    const date = new Date().toISOString().replace(/(-|:|\.\d{3}Z)/g, "");
    const ticket = baseBranchName.replace(/\//, ".");

    intVersion = `${prodVersion}-alpha.${baseCommitHash.slice(
      0,
      7
    )}-${ticket}.${date}`; // e.g. 1.2.3-alpha.1234567-epic.NOP-29.20230413T075727
  }

  // console.log(intVersion);

  console.log(
    baseBranchName,
    triggerCommitHash,
    developCommitHash,
    prodVersion,
    baseCommitHash,
    intVersion
  );
}

const main = () => {
  const command = process.argv[2];
  const args = process.argv.slice(3); // [base branch name, commit hash triggered workflow, develop branch last commit hash]

  switch (command) {
    case "integrate-version":
      printIntegratedVersion(...args);
      break;
    default:
  }
};

main();
