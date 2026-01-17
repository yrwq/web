export async function downloadBlogPostPDF(title: string): Promise<void> {
	try {
		const loadingMessage = document.createElement("div");
		loadingMessage.textContent = "Preparing PDF...";
		loadingMessage.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: #1a202c;
			color: white;
			padding: 12px 20px;
			border-radius: 8px;
			z-index: 1000;
			font-family: system-ui, -apple-system, sans-serif;
		`;
		document.body.appendChild(loadingMessage);

		const printWindow = window.open("", "_blank");
		if (!printWindow) {
			throw new Error("Could not open print window. Please allow popups.");
		}

		const article = document.querySelector("article");
		if (!article) {
			throw new Error("Could not find article content");
		}

		const printHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        h1 {
            font-size: 2.5em;
            margin-bottom: 0.5em;
            color: #1a202c;
        }

        .meta {
            color: #666;
            margin-bottom: 2em;
            font-size: 0.9em;
        }

        .tag {
            display: inline-block;
            background: #e2e8f0;
            padding: 0.25em 0.5em;
            margin-right: 0.5em;
            border-radius: 0.25em;
            font-size: 0.8em;
        }

        h2, h3, h4, h5, h6 {
            margin-top: 2em;
            margin-bottom: 1em;
            color: #2d3748;
        }

        p {
            margin-bottom: 1em;
        }

        code {
            padding: 0.2em 0.4em;
            border-radius: 0.25em;
            font-family: 'Monaco', 'Menlo', monospace;
        }

        pre {
            padding: 1em;
            border-radius: 0.5em;
            overflow-x: auto;
            margin-bottom: 1em;
        }

        pre.shiki {
            font-family: 'Iosevka', 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
            line-height: 1.6;
            padding: 1em;
        }

        pre.shiki code {
            font-family: inherit;
        }

        blockquote {
            border-left: 4px solid #cbd5e0;
            padding-left: 1em;
            margin: 1em 0;
            color: #4a5568;
        }

        a {
            color: #3182ce;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        @media print {
            body {
                padding: 0;
            }
        }

        .no-print {
            display: none;
        }
    </style>
</head>
<body>
    ${article.innerHTML}
</body>
</html>`;

		printWindow.document.write(printHTML);
		printWindow.document.close();

		setTimeout(() => {
			printWindow.print();

			setTimeout(() => {
				printWindow.close();
			}, 1000);
		}, 500);

		document.body.removeChild(loadingMessage);
	} catch (_error) {
		const errorMessage = document.createElement("div");
		errorMessage.textContent = "Failed to generate PDF. Please try again.";
		errorMessage.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: #dc2626;
			color: white;
			padding: 12px 20px;
			border-radius: 8px;
			z-index: 1000;
			font-family: system-ui, -apple-system, sans-serif;
		`;
		document.body.appendChild(errorMessage);

		setTimeout(() => {
			if (document.body.contains(errorMessage)) {
				document.body.removeChild(errorMessage);
			}
		}, 3000);
	}
}
