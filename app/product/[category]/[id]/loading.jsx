export default function Loading() {
    return (
        <main className="min-h-screen bg-background pt-20">
            {/* Skeleton breadcrumb */}
            <div className="container mx-auto px-6 py-6">
                <div className="h-4 w-64 bg-charcoal/50 rounded animate-pulse" />
            </div>

            {/* Skeleton product section */}
            <div className="container mx-auto px-6 pb-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Skeleton image gallery */}
                    <div>
                        <div className="aspect-square bg-charcoal/30 rounded-xl animate-pulse mb-4" />
                        <div className="flex gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="w-20 h-20 bg-charcoal/30 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    </div>

                    {/* Skeleton product info */}
                    <div className="space-y-6">
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-5 h-5 bg-charcoal/50 rounded-full animate-pulse" />
                            ))}
                        </div>
                        <div className="h-10 bg-charcoal/50 w-3/4 rounded animate-pulse" />
                        <div className="h-8 bg-charcoal/50 w-1/3 rounded animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 bg-charcoal/50 w-full rounded animate-pulse" />
                            <div className="h-4 bg-charcoal/50 w-full rounded animate-pulse" />
                            <div className="h-4 bg-charcoal/50 w-2/3 rounded animate-pulse" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-5 bg-charcoal/50 w-3/4 rounded animate-pulse" />
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <div className="h-14 w-32 bg-charcoal/50 rounded-lg animate-pulse" />
                            <div className="h-14 flex-1 bg-charcoal/50 rounded-lg animate-pulse" />
                            <div className="h-14 w-14 bg-charcoal/50 rounded-lg animate-pulse" />
                        </div>
                        <div className="h-28 bg-charcoal/30 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        </main>
    );
}
