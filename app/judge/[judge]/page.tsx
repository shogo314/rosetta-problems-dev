import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export async function generateStaticParams() {
  const baseDir = path.join(process.cwd(), "data/judge");
  const entries = await fs.readdir(baseDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ judge: entry.name }));
}

export default async function Page({ params }: { params: Promise<{ judge: string }> }) {
  const { judge } = await params;

  const judgeDir = path.join(process.cwd(), "data/judge", judge);
  const infoPath = path.join(judgeDir, "info.json");
  const problemPath = path.join(judgeDir, "problem.json");

  try {
    const [infoRaw, problemRaw] = await Promise.all([
      fs.readFile(infoPath, "utf-8"),
      fs.readFile(problemPath, "utf-8"),
    ]);

    const judgeData = JSON.parse(infoRaw);
    const problemList: { id: string; url: string }[] = JSON.parse(problemRaw);
    const themeDir = path.join(process.cwd(), "data/problem");
    const themeFiles = await fs.readdir(themeDir);
    const linkedProblems = new Set<string>();
    for (const filename of themeFiles) {
      if (!filename.endsWith(".json")) continue;
      const theme = JSON.parse(await fs.readFile(path.join(themeDir, filename), "utf-8"));
      for (const source of theme.sources ?? []) {
        if (source.judge === judge && source.problem) linkedProblems.add(source.problem);
      }
    }

    return (
      <div className="p-6">
        {/* ジャッジ一覧に戻るリンク */}
        <div className="mb-4">
          <Link href="/judge" className="text-blue-600 underline">
            ← ジャッジ一覧に戻る
          </Link>
        </div>

        <h1 className="text-2xl font-bold">{judgeData.name}</h1>
        <p className="mt-2">{judgeData.description}</p>

        {problemList.length > 0 && (
          <>
            <h2 className="mt-8 text-xl font-semibold">問題一覧</h2>
            <ul className="list-disc ml-6 mt-2">
              {problemList.map((problem) => (
                <li key={problem.id}>
                  <Link href={linkedProblems.has(problem.id) ? `/judge/${judge}/${problem.id}` : problem.url} className="text-blue-600 underline">
                    {problem.id}
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
