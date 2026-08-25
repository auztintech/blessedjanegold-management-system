import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <p>This Page is under maintanance, please check back</p>
      <Link href="/dashboard">Return Home</Link>
    </div>
  );
}
