export default function Loading() {
    return (
        <main className="min-h-screen bg-background pt-15">
            {/* Skeleton hero */}
            <div className="h-[40vh] bg-charcoal/50 animate-pulse" />

            {/* Skeleton toolbar */}
            <div className="container mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-28 bg-charcoal/50 rounded-lg animate-pulse" />
                        <div className="h-5 w-20 bg-charcoal/50 rounded animate-pulse" />
                    </div>
                    <div className="h-10 w-36 bg-charcoal/50 rounded-lg animate-pulse" />
                </div>

                {/* Skeleton product grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-charcoal/30 rounded-lg overflow-hidden border border-white/5">
                            <div className="aspect-square bg-charcoal/50 animate-pulse" />
                            <div className="p-5 space-y-3">
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <div key={j} className="w-4 h-4 bg-charcoal/50 rounded-full animate-pulse" />
                                    ))}
                                </div>
                                <div className="h-5 bg-charcoal/50 w-3/4 rounded animate-pulse" />
                                <div className="h-6 bg-charcoal/50 w-1/2 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
