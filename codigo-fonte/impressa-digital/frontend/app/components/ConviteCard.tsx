// components/ConviteCard.tsx
import Image from "next/image";

interface ConviteCardProps {
  image: string;
  title: string;
}

export default function ConviteCard({ image, title }: ConviteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer">
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
    </div>
  );
}
