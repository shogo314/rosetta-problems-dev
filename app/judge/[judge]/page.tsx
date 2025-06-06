import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "data/judge");
  const files = await fs.readdir(dir);
  return files.map((name) => ({ judge: name.replace(".json", "") }));
}

export default async function Page({ params }: { params: Promise<{ judge: string }> }) {
  const { judge } = await params;

  const judgePath = path.join(process.cwd(), "data/judge", `${judge}.json`);
  try {
    const judgeFile = await fs.readFile(judgePath, "utf-8");
    const judgeData = JSON.parse(judgeFile);

    const judgeProblemDir = path.join(process.cwd(), "data/judge-problem", judge);
    const problemFiles = await fs.readdir(judgeProblemDir);

    const slugs = problemFiles
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(/\.json$/, ""));

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

        {slugs.length > 0 && (
          <>
            <h2 className="mt-8 text-xl font-semibold">問題一覧</h2>
            <ul className="list-disc ml-6 mt-2">
              {slugs.map((slug) => (
                <li key={slug}>
                  <Link href={`/judge/${judge}/${slug}`} className="text-blue-600 underline">
                    {slug}
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
