import Link from "next/link";

export default function Navbar() {
    return (
        <header className="p-4">
            <nav>
                <ul className="flex gap-4">
                    <li><a href="/">Home</a></li>
                    <li><Link href="/test">Test</Link></li>
                </ul>
            </nav>
        </header>
    );
}