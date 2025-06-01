import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { cache } from "react";

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
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
