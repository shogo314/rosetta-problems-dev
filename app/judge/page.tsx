import fs from "fs/promises";
import path from "path";
import Link from "next/link";

// countryCodeToEmojiは使わず、flag-iconsのクラスを付与するだけに変更
function FlagIcon({ code }: { code: string | null }) {
  if (!code) return null;
  const cc = code.toLowerCase();
  return <span className={`fi fi-${cc} inline-block mr-2`} />;
}

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
