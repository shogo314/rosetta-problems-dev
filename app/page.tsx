import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export default async function Page() {
  const judgeDir = path.join(process.cwd(), "data/judge");
  const judgeFiles = await fs.readdir(judgeDir);
  const judges = await Promise.all(
    judgeFiles
      .filter((f) => f.endsWith(".json"))
      .map(async (file) => {
        const content = await fs.readFile(path.join(judgeDir, file), "utf-8");
        return JSON.parse(content);
      })
  );

  const problemDir = path.join(process.cwd(), "data/problem");
  const problemFiles = await fs.readdir(problemDir);
  const problems = await Promise.all(
    problemFiles
      .filter((f) => f.endsWith(".json"))
      .map(async (file) => {
        const content = await fs.readFile(path.join(problemDir, file), "utf-8");
        return JSON.parse(content);
      })
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Rosetta Problems</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">ジャッジ一覧</h2>
        <ul className="list-disc ml-6">
          {judges.map((judge) => (
            <li key={judge.slug}>
              <Link href={`/judge/${judge.slug}`} className="text-blue-600 underline">
                {judge.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">問題一覧</h2>
        <ul className="list-disc ml-6">
          {problems.map((problem) => (
            <li key={problem.id}>
              <Link href={`/problem/${problem.id}`} className="text-blue-600 underline">
                {problem.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
