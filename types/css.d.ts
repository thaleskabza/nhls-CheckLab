// Allows side-effect CSS imports like: import "@ui/theme/nhls.css";
declare module "*.css";

// If you also use CSS Modules (e.g. .module.css), keep this too:
declare module "*.module.css" {
  const classes: { [className: string]: string };
  export default classes;
}
