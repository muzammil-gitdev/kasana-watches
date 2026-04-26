"use client"

import { useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"

export default function TestDB() {
    useEffect(() => {
        const test = async () => {
            try {
                const res = await addDoc(collection(db, "test"), {
                    message: "DB Connected",
                    createdAt: new Date(),
                })

                console.log("✅ SUCCESS:", res.id)
            } catch (err) {
                console.error("❌ ERROR:", err)
            }
        }

        test()
    }, [])

    return <h1>Check console</h1>
}