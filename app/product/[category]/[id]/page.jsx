import { watchesData, categoryTitles } from "@/lib/products";
import ProductDetailContent from "./ProductDetailContent";

export async function generateMetadata({ params }) {
    const { category, id } = await params;
    const watches = watchesData[category] || watchesData.men;
    const product = watches.find((w) => w.id === parseInt(id));

    if (!product) {
        return {
            title: "Product Not Found | Kasana Watches",
        };
    }

    return {
        title: `${product.name} | ${categoryTitles[category] || "Kasana Watches"}`,
        description: product.description,
    };
}

export default async function ProductDetailPage({ params }) {
    const { category, id } = await params;
    return <ProductDetailContent category={category} id={id} />;
}
