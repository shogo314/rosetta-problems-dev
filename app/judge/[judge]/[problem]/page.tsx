import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";

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

export default async function Page({ params }: { params: { judge: string; problem: string } }) {
  const filePath = path.join(process.cwd(), "data/judge-problem", params.judge, `${params.problem}.json`);
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const problem = JSON.parse(file);

    // ローカル問題データのパス
    const localProblemDir = path.join(process.cwd(), "data/problem");
    const localFiles = await fs.readdir(localProblemDir);

    // judge/problem の組み合わせと完全一致するローカル問題を探す
    const linkedLocalProblems = [];
    for (const f of localFiles) {
      if (!f.endsWith(".json")) continue;
      const content = await fs.readFile(path.join(localProblemDir, f), "utf-8");
      const localProb = JSON.parse(content);
      if (!localProb.sources) continue;

      const match = localProb.sources.some(
        (src: { judge: string; problem: string }) =>
          src.judge === params.judge && src.problem === params.problem
      );

      if (match) {
        linkedLocalProblems.push(localProb);
      }
    }

    return (
      <div className="p-6">
        {/* 親ジャッジページへのリンク */}
        <div className="mb-4">
          <Link href={`/judge/${params.judge}`} className="text-blue-600 underline">
            ← {params.judge} に戻る
          </Link>
        </div>

        <h1 className="text-2xl font-bold">{problem.title}</h1>

        <a
          href={problem.url}
          className="text-blue-600 underline mt-4 block"
          target="_blank"
          rel="noopener noreferrer"
        >
          オリジナルページを開く
        </a>

        {linkedLocalProblems.length > 0 && (
          <>
            <h2 className="mt-8 text-xl font-semibold">対応するローカル問題</h2>
            <ul className="list-disc ml-6 mt-2">
              {linkedLocalProblems.map((lp) => (
                <li key={lp.id}>
                  <Link href={`/problem/${lp.id}`} className="text-blue-600 underline">
                    {lp.title}
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
