import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

/** Cadre de téléphone sobre pour présenter une capture d'écran mobile. */
export default function PhoneFrame({ src, alt, width, height, className = "" }: Props) {
  return (
    <div
      className={`w-full max-w-[190px] rounded-[1.75rem] border border-line bg-neutral-900 p-1.5 shadow-2xl ${className}`}
    >
      <div className="overflow-hidden rounded-[1.4rem] bg-white">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 640px) 45vw, 190px"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
