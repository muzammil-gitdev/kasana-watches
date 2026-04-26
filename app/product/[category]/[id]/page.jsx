import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { categoryTitles } from "@/lib/constants";
import ProductDetailContent from "./ProductDetailContent";

export async function generateMetadata({ params }) {
    const { category, id } = await params;
    
    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const product = docSnap.data();
            return {
                title: `${product.name} | ${categoryTitles[category] || "Kasana Watches"}`,
                description: product.description,
            };
        }
    } catch (error) {
        console.error("Metadata fetch error:", error);
    }

    return {
        title: "Kasana Watches",
    };
}

export default async function ProductDetailPage({ params }) {
    const { category, id } = await params;
    return <ProductDetailContent category={category} id={id} />;
}
