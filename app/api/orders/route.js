import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendOrderEmail } from "@/lib/mail";

export async function POST(request) {
  try {
    const orderData = await request.json();

    // 1. Save to Firestore
    const orderRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: "placed",
      createdAt: serverTimestamp(),
    });

    const orderId = orderRef.id;

    // 2. Send Email
    try {
      await sendOrderEmail({
        id: orderId,
        customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        customerEmail: orderData.customerInfo.email,
        total: orderData.total,
      }, "placed");
    } catch (emailError) {
      console.error("Failed to send order email:", emailError);
      // We don't fail the order if only email fails
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
  }
}
