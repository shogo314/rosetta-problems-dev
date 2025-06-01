import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "data/judge");
  const files = await fs.readdir(dir);
  return files.map((name) => ({ judge: name.replace(".json", "") }));
}

export default async function Page({ params }: { params: { judge: string } }) {
  const judgePath = path.join(process.cwd(), "data/judge", `${params.judge}.json`);
  try {
    const judgeFile = await fs.readFile(judgePath, "utf-8");
    const judge = JSON.parse(judgeFile);

    const judgeProblemDir = path.join(process.cwd(), "data/judge-problem", params.judge);
    const problemFiles = await fs.readdir(judgeProblemDir);

    const problems = [];
    for (const file of problemFiles) {
      if (!file.endsWith(".json")) continue;
      const content = await fs.readFile(path.join(judgeProblemDir, file), "utf-8");
      const problem = JSON.parse(content);
      const slug = file.replace(/\.json$/, "");
      problems.push({ ...problem, slug });
    }

    return (
      <div className="p-6">
        {/* ジャッジ一覧に戻るリンク */}
        <div className="mb-4">
          <Link href="/judge" className="text-blue-600 underline">
            ← ジャッジ一覧に戻る
          </Link>
        </div>

        <h1 className="text-2xl font-bold">{judge.name}</h1>
        <p className="mt-2">{judge.description}</p>

        {problems.length > 0 && (
          <>
            <h2 className="mt-8 text-xl font-semibold">問題一覧</h2>
            <ul className="list-disc ml-6 mt-2">
              {problems.map((p) => (
                <li key={p.slug}>
                  <Link href={`/judge/${params.judge}/${p.slug}`} className="text-blue-600 underline">
                    {p.title}
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
