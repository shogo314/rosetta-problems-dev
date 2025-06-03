import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { cache } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";


const getProblems = cache(async () => {
  const dirPath = path.join(process.cwd(), "data/problem");
  const fileNames = await fs.readdir(dirPath);
  const problemIds = fileNames.filter(f => f.endsWith(".json")).map(f => f.replace(/\.json$/, ""));
  const problems = await Promise.all(
    problemIds.map(async (id) => {
      const fileContent = await fs.readFile(path.join(dirPath, `${id}.json`), "utf-8");
      return JSON.parse(fileContent);
    })
  );
  return problems;
});

export default async function ProblemListPage() {
  const problems = await getProblems();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">問題一覧</h1>
      <ul className="list-disc ml-6 mt-2">
        {problems.map(p => (
          <li key={p.id}>
            <Link href={`/problem/${p.id}`} className="text-blue-600 underline">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />
                  ),
                  p: ({ node, ...props }) => <span {...props} />  // <p> を <span> に変換してレイアウト崩れを防ぐ
                }}
              >
                {p.title}
              </ReactMarkdown>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
