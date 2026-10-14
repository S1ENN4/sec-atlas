// Prose for the configuration labs and the tabletop (English source; pt/es are overlays).
export const labMoreUi = {
  settings: "Settings",
  runTests: "run the attacks",
  testsTitle: "Pentest results",
  attackBlocked: "attack blocked",
  attackWorks: "attack succeeds",
  stillWorks: "still works",
  nowBroken: "broken by your change",
  allGreen: "All attacks blocked, and the team's work still runs.",
  someRed: "Not yet. Adjust the settings and run again.",
  notRun: "Choose settings, then run the attacks.",
  stepOf: "Decision {n} of {total}",
  chooseOne: "Choose one.",
  score: "Score: {score} of {max}",
  next: "next decision",
  seeResult: "see the debrief",
  restart: "try again",
  debrief: "Debrief",
};

export const labMoreExercises = {
  ci: {
    title: "Harden the deploy workflow",
    story: "The deploy workflow from the Atlas repository is live. A test team will now try five attacks on it. Change each risky setting, but keep the workflow doing its job.",
    goal: "Block all five attacks without breaking the three things the team needs.",
    why: "Untrusted pull requests must never run with trusted secrets, permissions start read-only, values that come from the pull request travel as data in environment variables, and third-party code is pinned to an exact commit.",
    hint: "Over-correcting breaks the team's work: pick the setting that is both safe and useful.",
    choices: {
      trigger: {
        label: "When does it run?",
        options: {
          "pr-target": "Runs with secrets and a write token, even for pull requests from strangers.",
          pr: "Runs for pull requests with a read-only token, and no secrets for forks.",
          manual: "Only runs when someone clicks a button, so pull requests are never previewed.",
        },
      },
      perms: {
        label: "What can the token do?",
        options: {
          "write-all": "Every step gets full write access.",
          "read-only": "Starts read-only. A job can ask for more when it really needs it.",
          none: "No permissions at all, so the job cannot even read the code.",
        },
      },
      checkout: {
        label: "Which code does it run?",
        options: {
          "head-sha": "Checks out and runs the pull request's own code.",
          "default-ref": "Uses the default checkout, which is safe with the pull_request trigger.",
          "fixed-main": "Always tests the main branch, never the change being proposed.",
        },
      },
      title: {
        label: "How is the pull request title used?",
        options: {
          inline: "The title is pasted into the shell script.",
          env: "The title is passed as an environment variable and treated as data.",
        },
      },
      action: {
        label: "How is the cloud action referenced?",
        options: {
          "at-main": "A moving branch: whoever controls it controls what runs.",
          pinned: "Pinned to an exact commit that cannot change.",
        },
      },
    },
    tests: {
      a1: "A stranger's pull request can read repository secrets",
      a2: "The workflow token can push to the repository",
      a3: "Code from the pull request runs next to the deploy credentials",
      a4: "A crafted pull request title runs shell commands",
      a5: "A hijacked action tag changes what runs",
      l1: "Team pull requests get a preview deploy",
      l2: "The job can read the repository",
      l3: "The job tests the proposed change",
    },
  },
  iam: {
    title: "Tighten the API's cloud role",
    story: "The API runs with a cloud role that is far too broad. Change each statement so the API can still do its job and nothing else.",
    goal: "Block three abuses without breaking the two things the API needs.",
    why: "Grant exact actions on exact resources. The API needs to read tile objects and its own secret, and it never needs to pass roles, so those get the narrowest permission that works.",
    hint: "A deny that blocks everything also blocks what the API needs.",
    choices: {
      tiles: {
        label: "Tile bucket",
        options: {
          "s3-all": "Every S3 action on the tile objects, including delete and overwrite.",
          "s3-get": "Only reading tile objects.",
          "s3-deny": "Denies all S3 access, so the API cannot read tiles.",
        },
      },
      secrets: {
        label: "Secrets",
        options: {
          "sm-all": "Read, write and delete every secret in the account.",
          "sm-scoped": "Read only the API's own secrets.",
          "sm-deny": "Denies every secret, so the API cannot read its database password.",
        },
      },
      passrole: {
        label: "Passing roles",
        options: {
          "pass-all": "Lets the role hand any role, even an administrator, to a new workload.",
          "pass-none": "Denies passing roles. The API never needs it.",
        },
      },
    },
    tests: {
      a1: "The role can delete or overwrite map tiles",
      a2: "The role can read other teams' secrets",
      a3: "The role can start a workload with an administrator role",
      l1: "The API reads tiles to serve maps",
      l2: "The API reads its own database password",
    },
  },
  bucket: {
    title: "Lock down the tile bucket",
    story: "Tiles must load fast for everyone, but only through the CDN, which adds caching, logging and a firewall. Right now the bucket itself is open to the world.",
    goal: "Block both abuses and keep tiles loading through the CDN.",
    why: "Public does not have to mean open to everyone. Let only the CDN read objects, and only read them. Visitors still get tiles, and nobody can write, delete or bypass the CDN.",
    hint: "Visitors reach the CDN, and the CDN reaches the bucket.",
    choices: {
      principal: {
        label: "Who may read?",
        options: {
          anyone: "Anyone on the internet, straight from the bucket.",
          cdn: "Only the CDN, which adds caching, logging and a firewall.",
          nobody: "Only the account owner, so the CDN cannot fetch tiles.",
        },
      },
      action: {
        label: "What may they do?",
        options: {
          "all-actions": "Every S3 action: read, list, upload and delete.",
          "get-only": "Only reading objects.",
          "list-only": "Only listing keys, so no tile can be fetched.",
        },
      },
    },
    tests: {
      a1: "Anyone can upload or delete tiles",
      a2: "Anyone can fetch tiles straight from the bucket, skipping the CDN",
      l1: "The CDN can fetch tiles for visitors",
    },
  },
  tabletop: {
    title: "The 3 a.m. alert",
    story: "You are the on-call engineer at Atlas. The SIEM says the CI deploy key was used from a country the company has never worked in. Make five decisions, and see how they play out.",
    goal: "Contain the incident, keep the evidence and stop it from happening again.",
    why: "Good response is calm and ordered: stop the damage, keep the evidence, find the reach, communicate with facts, and fix the cause.",
    hint: "Revoke first, investigate second, and keep the evidence.",
    debriefGood: "You contained it quickly, kept the evidence and fixed the cause. The review will be short.",
    debriefBad: "Some choices cost evidence or time. Read the feedback and try again.",
    steps: {
      s1: {
        prompt: "03:12. The alert says the CI cloud key listed the tile bucket from an unknown country. What do you do first?",
        options: {
          revoke: { text: "Revoke the key now.", feedback: "Right. Cutting off a live credential is the fastest way to stop the damage, and revoking does not destroy evidence." },
          wait: { text: "Wait until morning to confirm with the team.", feedback: "The attacker keeps access for hours. A suspected live credential should be revoked first and questions asked after." },
          "delete-repo": { text: "Delete the repository so nothing else can leak.", feedback: "That destroys the evidence you need and does not stop a key that is already out. Revoke the key instead." },
        },
      },
      s2: {
        prompt: "The key is revoked. What do you do about the evidence?",
        options: {
          preserve: { text: "Export the cloud audit logs and the alert, and snapshot the repository history.", feedback: "Right. Preserve before you change anything, so you can reconstruct what happened." },
          "clean-logs": { text: "Clean up the noisy logs to make them easier to read.", feedback: "Never alter evidence. Filter a copy if you need to." },
          rewrite: { text: "Rewrite git history right away to remove the file.", feedback: "The file must go eventually, but history still holds a copy of the key until it is revoked, and rewriting first hides when it was exposed. Preserve first." },
        },
      },
      s3: {
        prompt: "What else could the same key, or the same file, have exposed?",
        options: {
          "rotate-all": { text: "Rotate every secret in the CI environment and the database password, and review the role's permissions.", feedback: "Right. Assume everything the file or the key could reach is compromised." },
          "nothing-else": { text: "Nothing else, the key was only for deploys.", feedback: "The same file also held a database password. Always check what else was in the leak." },
          "only-key": { text: "Rotate only the leaked key.", feedback: "Better than nothing, but the database password was in the same file and is just as exposed." },
        },
      },
      s4: {
        prompt: "How do you find out what the attacker actually touched?",
        options: {
          "query-logs": { text: "Query the access logs for that key, from first use to revocation: listings, reads and writes.", feedback: "Right. The logs answer what was reached. Here it was listing and downloading public tiles only." },
          "notify-all": { text: "Assume the worst and notify every customer immediately.", feedback: "Customers deserve accurate information. Check the facts first, then notify with specifics if data was reached." },
          "assume-none": { text: "Assume nothing was touched.", feedback: "Assumptions are not evidence. Look at the logs." },
        },
      },
      s5: {
        prompt: "How do you stop this from happening again?",
        options: {
          controls: { text: "Enable push protection and a secrets scan, remove the admin bypass of reviews, and move CI to short-lived credentials.", feedback: "Right. Fix the system so the mistake is blocked, instead of relying on people never slipping." },
          "be-careful": { text: "Tell developers to be more careful.", feedback: "People will slip again. Add controls that catch the mistake automatically." },
          wiki: { text: "Add a rule about secrets to the wiki.", feedback: "Documentation helps, but it does not block the next commit. Combine it with automatic controls." },
        },
      },
    },
  },
};
