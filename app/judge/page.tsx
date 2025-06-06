import fs from "fs/promises";
import path from "path";
import Link from "next/link";

function FlagIcon({ code }: { code: string | null }) {
  if (!code) return null;
  const cc = code.toLowerCase();
  return <span className={`fi fi-${cc} inline-block mr-2`} />;
}

export default async function Page() {
  const baseDir = path.join(process.cwd(), "data/judge");
  const judgeDirs = await fs.readdir(baseDir, { withFileTypes: true });

  const judges = await Promise.all(
    judgeDirs
      .filter((dirent) => dirent.isDirectory())
      .map(async (dirent) => {
        const slug = dirent.name;
        const infoPath = path.join(baseDir, slug, "info.json");

        const content = await fs.readFile(infoPath, "utf-8");
        const data = JSON.parse(content);
        return { ...data, slug };
      })
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">ジャッジ一覧</h1>
      <ul className="list-disc mt-4 ml-6">
        {judges.map((judge: any) => (
          <li key={judge.slug} className="flex items-center space-x-2">
            <FlagIcon code={judge.country} />
            <Link href={`/judge/${judge.slug}`} className="text-blue-600 underline">
              {judge.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
