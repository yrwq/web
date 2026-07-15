import { AppWindow, Monitor, Package, Terminal } from "lucide-react";
import { getStaticRouteSeo } from "@/app/route-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Seo } from "@/components/seo/Seo";
import { buildCanonicalUrl, SITE_URL } from "@/lib/seo";

function Section({
	icon,
	label,
	children,
}: {
	icon: React.ReactNode;
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="mb-6">
			<h2 className="text-accent font-semibold mb-3 flex items-center gap-2">
				{icon}
				{label}
			</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{children}</div>
		</div>
	);
}

function Item({
	name,
	note,
	href,
}: {
	name: string;
	note?: string;
	href?: string;
}) {
	const inner = (
		<>
			<div className="text-sm text-foreground">{name}</div>
			{note && <div className="text-xs text-muted mt-0.5">{note}</div>}
		</>
	);

	if (href) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noreferrer"
				className="border border-border p-3 hover:border-accent transition-colors"
			>
				{inner}
			</a>
		);
	}

	return <div className="border border-border p-3">{inner}</div>;
}

export function UsesPage() {
	return (
		<div className="p-4 md:p-6">
			<Seo {...getStaticRouteSeo("/uses")} />
			<JsonLd
				schema={{
					"@context": "https://schema.org",
					"@type": "BreadcrumbList",
					itemListElement: [
						{
							"@type": "ListItem",
							position: 1,
							name: "Home",
							item: SITE_URL,
						},
						{
							"@type": "ListItem",
							position: 2,
							name: "Uses",
							item: buildCanonicalUrl("/uses"),
						},
					],
				}}
			/>

			<Section icon={<Monitor size={16} />} label="$ cat hardware.md">
				<Item
					name="MacBook Pro 13&quot;"
					note="M1, 8GB"
					href="https://www.apple.com/macbook-pro/"
				/>
				<Item name="external monitor" note="secondary display" />
			</Section>

			<Section icon={<Terminal size={16} />} label="$ cat terminal.md">
				<Item
					name="Ghostty"
					note="terminal emulator"
					href="https://ghostty.org"
				/>
				<Item name="zsh" note="shell" href="https://zsh.sourceforge.io" />
				<Item
					name="bat"
					note="cat replacement"
					href="https://github.com/sharkdp/bat"
				/>
				<Item name="eza" note="ls replacement" href="https://eza.rocks" />
				<Item
					name="fd"
					note="find replacement"
					href="https://github.com/sharkdp/fd"
				/>
				<Item
					name="ripgrep"
					note="grep replacement"
					href="https://github.com/BurntSushi/ripgrep"
				/>
				<Item
					name="fzf"
					note="fuzzy finder"
					href="https://github.com/junegunn/fzf"
				/>
				<Item
					name="zoxide"
					note="cd replacement"
					href="https://github.com/ajeetdsouza/zoxide"
				/>
				<Item
					name="yazi"
					note="file manager"
					href="https://yazi-rs.github.io"
				/>
			</Section>

			<Section icon={<AppWindow size={16} />} label="$ cat editors.md">
				<Item
					name="WebStorm"
					note="web projects"
					href="https://www.jetbrains.com/webstorm/"
				/>
				<Item name="Zed" note="everything else" href="https://zed.dev" />
				<Item name="Neovim" note="quick edits" href="https://neovim.io" />
				<Item
					name="Emacs"
					note="notes and planning"
					href="https://www.gnu.org/software/emacs/"
				/>
			</Section>

			<Section icon={<Package size={16} />} label="$ cat apps.md">
				<Item
					name="Helium"
					note="daily browser"
					href="https://helium.computer"
				/>
				<Item
					name="Chrome"
					note="development"
					href="https://www.google.com/chrome/"
				/>
				<Item name="neomutt + mu4e" note="email" href="https://neomutt.org" />
				<Item name="OrbStack" note="containers" href="https://orbstack.dev" />
				<Item
					name="Raycast"
					note="app launcher"
					href="https://www.raycast.com"
				/>
				<Item
					name="Rectangle Pro"
					note="window snapping"
					href="https://rectangleapp.com/pro"
				/>
				<Item
					name="Hyperkey"
					note="modifier remap"
					href="https://hyperkey.app"
				/>
			</Section>
		</div>
	);
}
