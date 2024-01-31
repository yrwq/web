import { getPosts, getPost } from "@/lib/blog"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter";
import { NotFound } from "@/components/NotFound"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'

import {
  ChevronRight,
  Square,
  CheckSquare2,
  XSquare,
} from "lucide-react"

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

function notFirst(elem) {
  return elem != 1
}

export default async function PostPage({
  params,
}: {
  params: {
    slug: string
  }
}) {
  const post = await getPost(params.slug)
  if (!post) return NotFound()
    return (
      <div>
        <ReactMarkdown
          suppressHydrationWarning
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, children }) => {
              return (
                <p className="">{children}</p>
              )
            },
            table: ({ node, children }) => {
              return(
                <div>
                  <Table>
										<TableHeader>
											<TableRow>
												{children[0].props.children.props.children.map((child) => {
													return (
														<TableHead className="text-left">
															{child}
														</TableHead>
													)
												})}
											</TableRow>
                    </TableHeader>

                    <TableBody>
												{children.map((child) => {
													if (child.type == "tbody") {
														return (
															<>
																{child.props.children.map((ch) => {
																	return (
																		<TableRow className="min-w-max">
																			{ch.props.children.map((c) => {
																				return (
																						<TableCell>
																							{c}
																						</TableCell>
																				)
																			})}
																		</TableRow>
																	)
																})}
															</>
														)
													}
												})}
                    </TableBody>
                  </Table>
                </div>
              )
            },
            li: ({ node, children }) => {
              if (node.properties.className != undefined) {
                if (children[0].props.checked) {
                  return (
                    <li className="flex items-center"><CheckSquare2 className="mr-2"/>{children[2]}</li>
                  )
                } else {
                  return (
                    <li className="flex items-center"><XSquare className="mr-2"/>{children[2]}</li>
                  )
                }
              } else {
                return (
                  <li className="flex items-center"><Square size={12} className="mr-2"/> {children} </li>
                )
              }
            },
            code({ className, children }) {
              // if its a codeblock with a syntax like
              // ```language
              // ```
              if (className != undefined) {
                const language = className.replace("language-", "");
                return (
                  <SyntaxHighlighter
                    style={materialLight}
                    codeTagProps={{ className: 'code' }} 
                    customStyle={{ backgroundColor: '#00000000' }}
                    language={language}
                    children={children}
                  />
                );
              }
              // if its a block
              // `something`
              else {
                return (
                  <div className="rounded-md inline-flex bg-secondary max-w-min px-1 text-bold">{children}</div>
                )
              }
            },
          }}
        >
          {post?.body}</ReactMarkdown>
      </div>
    )
}
