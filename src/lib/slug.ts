/** URL segment of a published document: `McpServer` becomes `mcp-server`, `Shell` becomes `shell`. */
export function docSlug(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}
