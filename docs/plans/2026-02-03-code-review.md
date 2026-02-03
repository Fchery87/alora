# Code Review Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Perform a comprehensive code review of the repository and deliver a structured report with findings, fixes, and recommendations.

**Architecture:** Review the repo top-down: docs → config → dependencies → source modules → tests → CI. Capture issues with file references and propose targeted fixes with severity and impact.

**Tech Stack:** Determined during repo inspection (e.g., package manager, framework, backend, database, infra).

### Task 1: Inventory project structure

**Files:**
- Modify: `docs/plans/2026-02-03-code-review.md`

**Step 1: List top-level files and folders**

Run: `ls -la`
Expected: Top-level project structure.

**Step 2: Locate docs and config files**

Run: `rg --files -g 'README*' -g 'package.json' -g 'pyproject.toml' -g 'requirements*.txt' -g '*.csproj' -g '*.sln' -g 'Cargo.toml' -g 'go.mod' -g 'pom.xml' -g 'build.gradle*' -g '.env*' -g '*.config.*' -g '*.yaml' -g '*.yml' -g '*.toml' -g '*.json'`
Expected: List of key metadata and configuration files.

**Step 3: Update plan with observed stack hints**

Edit this plan with discovered stack components.

### Task 2: Understand purpose and architecture

**Files:**
- Modify: `docs/plans/2026-02-03-code-review.md`
- Read: `README*`, `docs/**`, `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`

**Step 1: Read primary docs**

Run: `rg --files -g 'README*'` then `sed -n '1,200p' <file>`
Expected: Project purpose and usage.

**Step 2: Inspect dependency manifests**

Run: `sed -n '1,200p' package.json` (or relevant manifest)
Expected: Languages, frameworks, and dependencies.

**Step 3: Summarize architecture**

Draft a short architecture summary in working notes.

### Task 3: Static code audit (quality, maintainability, performance)

**Files:**
- Read: `src/**`, `app/**`, `server/**`, `backend/**`, `api/**`

**Step 1: Identify code areas**

Run: `rg --files -g 'src/**' -g 'app/**' -g 'server/**' -g 'backend/**' -g 'api/**'`
Expected: Primary code paths.

**Step 2: Review modules by area**

Run: `sed -n '1,200p' <file>` for key entry points and representative modules.
Expected: Findings for readability, structure, and duplication.

**Step 3: Note performance smells**

Document any O(n^2), redundant computations, or heavy operations in hot paths.

### Task 4: Security and error handling audit

**Files:**
- Read: auth, data access, API endpoints, serialization, and config files

**Step 1: Search for risky patterns**

Run: `rg -n "eval\\(|exec\\(|innerHTML|dangerouslySetInnerHTML|raw\\(|sql\\("`
Expected: Potential injection/XSS entry points.

**Step 2: Check secrets handling**

Run: `rg -n "secret|api_key|apikey|token|password|passwd|private"`
Expected: Sensitive data exposure risks.

**Step 3: Review error handling**

Note try/catch usage, logging consistency, and error propagation.

### Task 5: Testing and CI/CD audit

**Files:**
- Read: `tests/**`, `__tests__/**`, config files for CI

**Step 1: Locate tests and configs**

Run: `rg --files -g 'tests/**' -g '__tests__/**' -g '.github/workflows/**' -g 'ci/**'`
Expected: Test coverage locations and pipeline config.

**Step 2: Assess coverage and gaps**

Summarize missing test types and low-coverage areas.

### Task 6: Compile report

**Files:**
- Read: working notes
- Output: user response

**Step 1: Build summary table**

List issues with file, severity, and recommendations.

**Step 2: Provide detailed explanations and fixes**

Add impact analysis and targeted fixes.

**Step 3: Provide general improvement plan and next steps**

Include refactoring, upgrades, documentation, and testing suggestions.
