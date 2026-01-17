import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "mdast";

/**
 * Remark plugin to remove the first h1 heading from MDX content
 * This prevents duplicate titles when the title is already rendered from frontmatter
 */
export const remarkRemoveFirstHeading: Plugin<[], Root> = () => {
  return (tree) => {
    let firstHeadingRemoved = false;

    visit(tree, "heading", (node, index, parent) => {
      if (
        !firstHeadingRemoved &&
        node.depth === 1 &&
        parent &&
        typeof index === "number"
      ) {
        parent.children.splice(index, 1);
        firstHeadingRemoved = true;
        return ["skip", index];
      }
    });
  };
};
