# Architecture

Shared memory for every agent. Read it before acting. The architect owns this file, except Guardrails (product-owner) and Quality Gates (devsecops).

## Guardrails
_Filled by the product-owner from the kickoff business interview. Mark anything not answered as `UNKNOWN`._
- Problem and users:
- Expected users (launch / 1 year):
- Monthly budget for hosting and paid services:
- Sensitive data (personal, payments, other) and user countries:
- Deadline for first usable version:
- Who maintains it after launch:
- Existing systems or accounts to use:
- Design direction (products with a UI): reference sites or apps, brand colors and logo, desired feeling, phone or computer first, existing designer or design files:

## Team
- Mode: single coder | fullstack (backend-dev + frontend-dev)
- ui-designer: on | off (on for any product with a user interface)

## Stack
_Language, framework, database, hosting target, and for a UI the component library. Link the ADR for each choice._

## Folder Structure
_Where product code and tests live, following the stack's standard layout at the project root (never inside `ai-team/`). In fullstack mode, list backend folders and frontend folders (default `apps/backend/`, `apps/frontend/`)._

## Commands
- Install:
- Build:
- Lint:
- Test:
- Run locally:

## Conventions
_Naming, error handling, logging, config via environment variables._

## Quality Gates
_Filled by devsecops: the exact command for each scanner, and whether it runs in CI._
- Dependencies:
- Secrets:
- SAST:
- Config / infrastructure:
