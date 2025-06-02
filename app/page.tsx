import Link from "next/link";

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Rosetta Problems</h1>
      <p>ようこそ！以下のページからジャッジ一覧や問題一覧をご覧いただけます。</p>
      <ul className="list-disc ml-6 mt-4">
        <li>
          <Link href="/judge" className="text-blue-600 underline">
            ジャッジ一覧
          </Link>
        </li>
        <li>
          <Link href="/problem" className="text-blue-600 underline">
            問題一覧
          </Link>
        </li>
      </ul>
    </div>
  );
}

