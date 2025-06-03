import { notFound } from "next/navigation";
import path from "path";
import fs from "fs/promises";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "data/problem");
  const files = await fs.readdir(dir);
  return files
    .filter((name) => name.endsWith(".json"))
    .map((name) => ({ slug: name.replace(".json", "") }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), "data/problem", `${slug}.json`);
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const problem = JSON.parse(file);

    return (
      <div className="p-6">
        {/* 問題一覧に戻るリンク */}
        <div className="mb-4">
          <a href="/problem" className="text-blue-600 underline">
            ← 問題一覧に戻る
          </a>
        </div>
        <h1 className="text-2xl font-bold">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />
              ),
            }}
          >
            {problem.title}
          </ReactMarkdown>
        </h1>
        <div className="mt-2 prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />
              ),
            }}
          >
            {problem.description}
          </ReactMarkdown>
        </div>

        <h2 className="mt-6 font-semibold">関連リンク</h2>
        <ul className="list-disc ml-6 mt-2">
          {problem.sources.map((s: any) => {
            if (s.judge && s.problem) {
              const href = `/judge/${s.judge}/${s.problem}`;
              return (
                <li key={`${s.judge}/${s.problem}`}>
                  <a href={href} className="text-blue-600 underline">
                    {`${s.judge}/${s.problem}`}
                  </a>
                </li>
              );
            } else if (s.url) {
              return (
                <li key={s.url}>
                  <a href={s.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                    {s.name ?? s.url}
                  </a>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );
  } catch (e) {
    return notFound();
  }
}
