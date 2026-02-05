import Image from 'next/image';

export default function TeamCard({ name, score, theme, imageUrl }) {
    // Map theme to backgound color class
    const themeColors = {
        red: 'bg-primary-red',
        blue: 'bg-primary-blue',
        green: 'bg-primary-green',
    };

    const bgColor = themeColors[theme] || 'bg-gray-200';

    return (
        <div className={`relative flex flex-col h-[80vh] w-full overflow-hidden ${bgColor} text-white transition-transform hover:scale-[1.02] duration-500`}>
            {/* Background Image with Grayscale */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover grayscale opacity-90 mix-blend-multiply"
                    priority
                />
                {/* Helper gradient for text readability if needed, though mix-blend might be enough */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6">
                {/* Header */}
                <h2 className="text-4xl font-bold tracking-tight uppercase font-anton drop-shadow-md">
                    {name}
                </h2>

                {/* Score Section */}
                <div className="flex flex-col items-center mb-10">
                    <span className="text-4xl md:text-5xl font-dancing text-white/90 drop-shadow-md rotate-[-5deg] mb-2">
                        Points
                    </span>
                    <span className="text-9xl font-anton tracking-tighter drop-shadow-2xl leading-none">
                        {score}
                    </span>
                </div>
            </div>

            {/* Decorative Wavy Lines (SVG) - Minimal corner decoration */}
            <svg className="absolute bottom-0 right-0 w-32 h-32 text-white/10 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0 100 C 20 0 50 0 100 100 Z" />
            </svg>
        </div>
    );
}
