#!/usr/bin/env bash
# Production release for vetta.agent9.dev (Pages "vetta") and vetta-ke.pages.dev (Pages "vetta-ke").
#
# Refuses to build unless this is a clean checkout of Agent9AI/vetting-loop at origin/main,
# the tests pass and the record gate passes. dist/ is deleted first so a failed tsc can never
# leave an older build to be uploaded.
#
#   scripts/deploy-prod.sh               verify, build, deploy to both Pages projects
#   scripts/deploy-prod.sh --build-only  verify and build; deploy app/dist elsewhere with the
#                                        same wrangler commands and the printed commit hash
set -euo pipefail
cd "$(dirname "$0")/.."

build_only=false
[ "${1:-}" = "--build-only" ] && build_only=true

fail() { echo "deploy-prod: $*" >&2; exit 1; }

case "$(git remote get-url origin)" in
  *Agent9AI/vetting-loop*) ;;
  *) fail "origin is not Agent9AI/vetting-loop, the only canonical repo" ;;
esac
[ -z "$(git status --porcelain --untracked-files=no)" ] || fail "uncommitted changes"
git fetch -q origin main
head=$(git rev-parse HEAD)
[ "$head" = "$(git rev-parse origin/main)" ] || fail "HEAD is not origin/main; pull or merge first"

npm test
npm run -s check:record
rm -rf app/dist
npm --prefix app run build
[ -f app/dist/index.html ] && [ -f app/dist/data/episode.json ] || fail "build produced no dist"

echo "commit $head"
sha256sum app/dist/data/episode.json

$build_only && exit 0
for project in vetta vetta-ke; do
  npx wrangler pages deploy app/dist --project-name "$project" --branch main \
    --commit-hash "$head" --commit-message "Agent9AI/vetting-loop main $head"
done
