// Type declarations for CSS side-effect imports
// This satisfies the IDE; Next.js handles CSS bundling at build time.
declare module "*.css" {
  const stylesheet: Record<string, string>;
  export default stylesheet;
}
