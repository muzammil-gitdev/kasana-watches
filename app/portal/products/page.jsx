import { Suspense } from "react";
import ProductsManager from "@/components/portal/ProductsManager";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-gray-500 p-8">Loading products...</div>}>
      <ProductsManager />
    </Suspense>
  );
}
