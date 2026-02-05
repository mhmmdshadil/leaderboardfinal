import Image from 'next/image';

export default function Header() {
    // Using ?raw=true to ensure we get the image file, not the GitHub blob page
    const logos = {
        kalastra: "/logos/kalastra-arts-fest.png",
        kalastraHindi: "/logos/kalastra-hindi.jpg",
        astra: "/logos/astra-college-union.jpg",
        college: "/logos/college-logo.jpg"
    };

    return (
        <header className="w-full bg-white py-4 px-4 md:px-12 flex flex-row items-center justify-between border-b border-gray-100 shadow-sm z-50 relative h-32 md:h-40">

            {/* Left Section: Kalastra + Hindi Logo */}
            <div className="flex items-center gap-4 md:gap-8">
                <div className="relative w-20 h-20 md:w-32 md:h-32">
                    <Image
                        src={logos.kalastra}
                        alt="Kalastra Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="relative w-28 h-20 md:w-48 md:h-32">
                    <Image
                        src={logos.kalastraHindi}
                        alt="Kalastra Hindi Logo"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Center Section: Spacer for layout balance */}
            <div className="flex-grow" />

            {/* Right Section: Astra + College Logo */}
            <div className="flex items-center gap-4 md:gap-8">
                <div className="relative w-20 h-20 md:w-32 md:h-32">
                    <Image
                        src={logos.astra}
                        alt="Astra Union Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="relative w-32 h-20 md:w-56 md:h-32">
                    <Image
                        src={logos.college}
                        alt="College Logo"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

        </header>
    );
}
