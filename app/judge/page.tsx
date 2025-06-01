// app/judge/page.tsx
import fs from "fs/promises";
import path from "path";
import Link from "next/link";

export default async function Page() {
  const dir = path.join(process.cwd(), "data/judge");
  const files = await fs.readdir(dir);

  const judges = await Promise.all(
    files
      .filter((name) => name.endsWith(".json"))
      .map(async (file) => {
        const content = await fs.readFile(path.join(dir, file), "utf-8");
        return JSON.parse(content);
      })
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">ジャッジ一覧</h1>
      <ul className="list-disc mt-4 ml-6">
        {judges.map((judge: any) => (
          <li key={judge.slug}>
            <Link href={`/judge/${judge.slug}`} className="text-blue-600 underline">
              {judge.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
