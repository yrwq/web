import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
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
