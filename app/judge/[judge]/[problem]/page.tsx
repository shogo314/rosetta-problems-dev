import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "data/judge-problem");
  const judges = await fs.readdir(dir);

  const params = [];
  for (const judge of judges) {
    const problemsDir = path.join(dir, judge);
    const files = await fs.readdir(problemsDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        params.push({
          judge,
          problem: file.replace(".json", ""),
        });
      }
    }
  }
  return params;
}

export default async function Page({ params }: { params: Promise<{ judge: string; problem: string }> }) {
  const { judge, problem } = await params;

  const filePath = path.join(process.cwd(), "data/judge-problem", judge, `${problem}.json`);
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const problemData = JSON.parse(file);

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
