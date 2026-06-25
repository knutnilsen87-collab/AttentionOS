$ErrorActionPreference = "Stop"

$ProjectRoot = "F:\prosjekter_MAIN\AttentionOS"
$ProjectName = "AttentionOS"
$ProjectType = "in_progress_project"
$StatusFile  = Join-Path $ProjectRoot "status_bundle.txt"
$ReadmeFile  = Join-Path $ProjectRoot "README_MASTER.md"

if (!(Test-Path $ProjectRoot)) {
    throw "Project root not found: $ProjectRoot"
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$status = @"
PROJECT_NAME=$ProjectName
PROJECT_ROOT=$ProjectRoot
PROJECT_TYPE=$ProjectType
SOURCE_OF_TRUTH=status_bundle.txt
WORKFLOW_MODE=PASTE_DIRECTLY_IN_POWERSHELL
STATUS_BUNDLE_IS_PRIMARY_DOCUMENT=true
PROJECT_STATE_CONFIDENCE=HIGH_FOR_LOCAL_MVP_LOW_FOR_PRODUCTION
LAST_UPDATED=$timestamp
CURRENT_PHASE=Continuation pack filled
LAST_ACTION=Filled continuation/completion workflow documents
LAST_RESULT=PASS
NEXT_ACTION=Commit filled pack and continue with persistence/auth/privacy
BUILD_STATUS=PASS
COMPILE_STATUS=PASS
RUNTIME_STATUS=PASS_LOCAL_SMOKE
DB_STATUS=UNKNOWN
AUTH_STATUS=NOT_IMPLEMENTED
TEST_STATUS=PASS
CI_STATUS=UNKNOWN
VERIFICATION_LEVEL=LOCAL_MVP_VERIFIED
TOP_BLOCKER=Persistence auth consent privacy and real extension capture are not implemented
RISKS=Prototype may be mistaken for production-ready; real user data requires privacy controls
NOTES=All future PowerShell blocks must update this file.

MACHINE_READABLE_JSON_BEGIN
{
  "project_name": "$ProjectName",
  "project_root": "$($ProjectRoot -replace '\\','\\\\')",
  "project_type": "$ProjectType",
  "source_of_truth": "status_bundle.txt",
  "workflow_mode": "paste_directly_in_powershell",
  "status_bundle_is_primary_document": true,
  "project_state_confidence": "HIGH_FOR_LOCAL_MVP_LOW_FOR_PRODUCTION",
  "last_updated": "$timestamp",
  "current_phase": "Continuation pack filled",
  "last_action": "Filled continuation/completion workflow documents",
  "last_result": "PASS",
  "next_action": "Commit filled pack and continue with persistence/auth/privacy",
  "build_status": "PASS",
  "compile_status": "PASS",
  "runtime_status": "PASS_LOCAL_SMOKE",
  "db_status": "UNKNOWN",
  "auth_status": "NOT_IMPLEMENTED",
  "test_status": "PASS",
  "ci_status": "UNKNOWN",
  "verification_level": "LOCAL_MVP_VERIFIED",
  "top_blocker": "Persistence auth consent privacy and real extension capture are not implemented",
  "risks": [
    "Prototype may be mistaken for production-ready",
    "Real user data requires privacy controls"
  ],
  "notes": [
    "All future PowerShell blocks must update this file."
  ]
}
MACHINE_READABLE_JSON_END
"@

$readme = @"
# README_MASTER

## Project
Name: $ProjectName
Type: $ProjectType

## Purpose
Use this continuation/completion pack to get a truthful view of the current project state and define the smartest path to completion.

## Source of truth
- status_bundle.txt for live execution status
- README_MASTER.md for overview and reading order

## Reading order
1. status_bundle.txt
2. Project_Continuation_Completion_Pack_Ultimate/README_MASTER.md
3. 01_PROJECT_IDENTITY/PROJECT_IDENTITY.md
4. 02_REALITY_CHECK/CURRENT_STATE_AUDIT.md
5. 03_SOURCE_OF_TRUTH/SOURCE_OF_TRUTH_MAP.md
6. 04_PRODUCT_SCOPE_STATUS/MVP_COMPLETION_PLAN.md
7. 05_TECHNICAL_BASELINE/TECHNICAL_BASELINE.md
8. 06_GAPS_BLOCKERS_TECH_DEBT/BLOCKERS_AND_RISKS.md
9. 07_COMPLETION_PLAN/NEXT_30_ACTIONS.md
10. 08_HANDOFF_ONBOARDING/DEVELOPER_HANDOFF_NOW.md
"@

Set-Content -Path $StatusFile -Value $status -Encoding UTF8
if (!(Test-Path $ReadmeFile)) {
    Set-Content -Path $ReadmeFile -Value $readme -Encoding UTF8
}

Write-Host ""
Write-Host "PASS: Continuation/completion bootstrap initialized" -ForegroundColor Green
Write-Host "PROJECT ROOT: $ProjectRoot" -ForegroundColor Cyan
Write-Host "STATUS FILE:  $StatusFile" -ForegroundColor Cyan
Write-Host ""
Get-Content $StatusFile
