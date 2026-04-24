import { categoryTitles, categoryDescriptions } from "@/lib/products";
import CollectionContent from "./CollectionContent";

export async function generateMetadata({ params }) {
    const { category } = await params;
    const title = categoryTitles[category] || "Collection";
    const description = categoryDescriptions[category] || "Explore our luxury watch collection.";

    return {
        title: `${title} | Kasana Watches`,
        description,
    };
}

export default async function CollectionPage({ params }) {
    const { category } = await params;
    return <CollectionContent category={category} />;
}
