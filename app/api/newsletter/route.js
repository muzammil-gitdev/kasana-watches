import { NextResponse } from "next/server";
import { sendNewsletterEmail } from "@/lib/mail";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function POST(request) {
  try {
    const { productName } = await request.json();

    if (!productName) {
      return NextResponse.json({ error: "Product name required" }, { status: 400 });
    }

    // Get all subscribers
    const querySnapshot = await getDocs(collection(db, "subscribed_users_email"));
    const emails = querySnapshot.docs.map(doc => doc.data().email);

    // Send emails to everyone
    const emailPromises = emails.map(email => sendNewsletterEmail(email, productName));
    await Promise.allSettled(emailPromises);

    return NextResponse.json({ success: true, count: emails.length });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
  }
}
