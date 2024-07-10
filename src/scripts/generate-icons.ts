import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const svgPath = join(__dirname, "../../public/icons");

const svgs = await fs.readdir(svgPath);

const icons = [];

for (const svg of svgs) {
  let svgString = await fs.readFile(join(svgPath, svg), "utf8");
  const iconFileName = `${svg.replace(".svg", "")}-icon.tsx`;

  const iconReactName = svg
    .replace(".svg", "")
    .split("-")
    .map((s: string) => s?.[0]?.toUpperCase() + s.slice(1))
    .join("");

  const iconSVGTitle = svg
    .replace(".svg", "")
    .split("-")
    .map((s: string) => s?.[0]?.toUpperCase() + s.slice(1))
    .join(" ");

  // ADD FILL CURRENTCOLOR
  svgString = svgString.replace(/fill="none"/g, "fill='currentColor'");

  // ADD CLASSNAME PROP
  svgString = svgString.replace(/<svg/g, "<svg className={className}");

  // ADD TITLE HTML TAG INSIDE SVG
  svgString = svgString.replace(
    'xmlns="http://www.w3.org/2000/svg">',
    `xmlns="http://www.w3.org/2000/svg"><title>${iconSVGTitle} Icon</title>`,
  );

  // REMOVE FILL BLACK
  svgString = svgString.replace(/fill="black"/g, "");

  const svgFileContent = `import type { Icon } from "../icons.type";

    export const ${iconReactName}Icon: Icon = ({ className }) => {
      return ${svgString};
    };
  `;

  icons.push({
    iconReactName: `${iconReactName}Icon`,
    fileName: iconFileName,
    content: svgFileContent,
  });
}

for (const icon of icons) {
  await fs.writeFile(
    join(__dirname, "../../src/components/ui/icons/generated/", icon.fileName),
    icon.content,
  );
}

const exportStatements = icons
  .map(
    (icon) =>
      `export { ${icon.iconReactName.replace(
        ".tsx",
        "",
      )} } from "./generated/${icon.fileName.replace(".tsx", "")}";`,
  )
  .join("\n");

await fs.writeFile(
  join(__dirname, "../../src/components/ui/icons/index.ts"),
  exportStatements,
);
