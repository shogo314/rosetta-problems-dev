export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export async function generateStaticParams() {
  const judgeBaseDir = path.join(process.cwd(), "data/judge");
  const judgeDirs = await fs.readdir(judgeBaseDir, { withFileTypes: true });

  const params = [];

  for (const dirent of judgeDirs) {
    if (!dirent.isDirectory()) continue;
    const judge = dirent.name;
    const problemPath = path.join(judgeBaseDir, judge, "problem.json");

    try {
      const content = await fs.readFile(problemPath, "utf-8");
      const problems: { id: string }[] = JSON.parse(content);

      for (const p of problems) {
        params.push({ judge, problem: p.id });
      }
    } catch {
      continue;
    }
  }

  return params;
}

export default async function Page({ params }: { params: Promise<{ judge: string; problem: string }> }) {
  const { judge, problem } = await params;

  const problemPath = path.join(process.cwd(), "data/judge", judge, "problem.json");
  try {
    const content = await fs.readFile(problemPath, "utf-8");
    const problems: any[] = JSON.parse(content);
    const problemData = problems.find((p) => p.id === problem);

    if (!problemData) return notFound();

    // ローカル対応問題の探索
    const localProblemDir = path.join(process.cwd(), "data/problem");
    const localFiles = await fs.readdir(localProblemDir);

    const linkedLocalProblems = [];
    for (const f of localFiles) {
      if (!f.endsWith(".json")) continue;
      const content = await fs.readFile(path.join(localProblemDir, f), "utf-8");
      const localProb = JSON.parse(content);
      if (!localProb.sources) continue;

      const match = localProb.sources.some(
        (src: { judge: string; problem: string }) =>
          src.judge === judge && src.problem === problem
      );

      if (match) {
        linkedLocalProblems.push(localProb);
      }
    }

    return (
      <div className="p-6">
        <div className="mb-4">
          <Link href={`/judge/${judge}`} className="text-blue-600 underline">
            ← {judge} に戻る
          </Link>
        </div>

        <h1 className="text-2xl font-bold">{problemData.title}</h1>

        <a
          href={problemData.url}
          className="text-blue-600 underline mt-4 block"
          target="_blank"
          rel="noopener noreferrer"
        >
          {problemData.url}
        </a>

        {linkedLocalProblems.length > 0 && (
          <>
            <h2 className="mt-8 text-xl font-semibold">対応するローカル問題</h2>
            <ul className="list-disc ml-6 mt-2">
              {linkedLocalProblems.map((lp) => (
                <li key={lp.id}>
                  <Link href={`/problem/${lp.id}`} className="text-blue-600 underline">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{ p: ({ node, ...props }) => <span {...props} /> }}
                    >
                      {lp.title}
                    </ReactMarkdown>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  } catch {
    return notFound();
  }
}
