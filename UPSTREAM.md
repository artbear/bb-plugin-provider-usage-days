# Upstream provenance

This is an independently installable derivative of BB's built-in Provider Usage
plugin, not a GitHub fork of the entire BB monorepo.

- Upstream repository: https://github.com/get-bb/bb
- Base commit: `7794941da1b6e2baf017e5f7ab65b5f223fcaf54`
- Plugin sources: `plugins/provider-usage/`
- Vendored UI sources: selected transitive dependencies from
  `packages/shared-ui/src/`, with `components/ui/icon.tsx` from
  `packages/plugin-registry/flavors/` using the public SDK icon component.
- License: MIT, original copyright retained in `LICENSE`.

Local changes add segmented quota meters for Codex weekly windows (7 days) and
Cursor (30 days), rename the package/plugin to `provider-usage-days`, and replace
workspace dependencies with local UI source and public npm packages. The usage
source protocol `provider-usage.v1.*` remains unchanged.

Keep upstream behavior fixes separate from the day-meter component when updating.
Review source-contract changes against the usage-source plugins installed in BB.
