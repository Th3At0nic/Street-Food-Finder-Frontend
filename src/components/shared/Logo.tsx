import Image from "next/image";


interface LogoProps {
    className?: string,
    width?: number;
    height?: number;
}

export default function Logo({ width = 60, height = 60, className }: LogoProps) {
    return (
        <Image
            className={className || ""}
            src="/images/logo.png"
            alt="StreetBites"
            width={width}
            height={height}
            priority
        />
    );
}
