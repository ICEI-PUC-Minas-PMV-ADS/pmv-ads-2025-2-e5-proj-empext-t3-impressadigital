import Image from 'next/image';
import Link from 'next/link';

export default function HeaderDashboard() {
  return (
    <header className="flex items-center justify-between p-6 bg-gray-100 border-b-[#D9D9D9] border-2">
      <Link href="/">
        <Image src="/images/logo_impressa_digital.png" alt="Logo" width={150} height={104} />
      </Link>
      <nav>
        <ul className="flex gap-4">
          <Image src="/images/person_icon.png" alt='Icone' width={37} height={37} className='transform transition-all duration-200 hover:scale-105 cursor-pointer'/>
        </ul>
      </nav>
    </header>
  );
}
