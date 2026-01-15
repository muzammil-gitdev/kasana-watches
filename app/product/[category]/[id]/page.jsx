"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ShoppingBag,
    Heart,
    Share2,
    Truck,
    Shield,
    RotateCcw,
    Star,
    Minus,
    Plus,
    ChevronRight,
    Check
} from "lucide-react";
import { use } from "react";
import Footer from "@/components/Footer";

// Same watch data as collection page - in a real app, this would come from an API/database
const watchesData = {
    men: [
        {
            id: 1,
            name: "Chronograph Elite",
            price: 24999,
            originalPrice: 29999,
            image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.8,
            reviews: 124,
            isNew: true,
            isSale: false,
            description: "The Chronograph Elite represents the pinnacle of precision engineering. Crafted with meticulous attention to detail, this timepiece features a Swiss-made automatic movement, sapphire crystal glass, and a 42mm stainless steel case. Perfect for the modern gentleman who appreciates both style and functionality.",
            features: [
                "Swiss Automatic Movement",
                "Sapphire Crystal Glass",
                "42mm Stainless Steel Case",
                "Water Resistant 100m",
                "Luminous Hands & Markers",
                "Date Display"
            ],
            specs: {
                caseMaterial: "Stainless Steel",
                caseSize: "42mm",
                dialColor: "Black",
                strapMaterial: "Genuine Leather",
                movement: "Swiss Automatic",
                waterResistance: "100m",
                warranty: "2 Years International"
            }
        },
        {
            id: 2,
            name: "Midnight Classic",
            price: 18999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.9,
            reviews: 89,
            isNew: false,
            isSale: false,
            description: "Embrace timeless elegance with the Midnight Classic. This sophisticated timepiece combines classic design elements with modern reliability. The deep midnight blue dial catches light beautifully, while the premium leather strap ensures all-day comfort.",
            features: [
                "Japanese Quartz Movement",
                "Hardened Mineral Crystal",
                "40mm Case Diameter",
                "Water Resistant 50m",
                "Quick-Release Strap",
                "Date Window"
            ],
            specs: {
                caseMaterial: "Stainless Steel",
                caseSize: "40mm",
                dialColor: "Midnight Blue",
                strapMaterial: "Italian Leather",
                movement: "Japanese Quartz",
                waterResistance: "50m",
                warranty: "2 Years International"
            }
        },
        {
            id: 3,
            name: "Royal Automatic",
            price: 42999,
            originalPrice: 49999,
            image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 5.0,
            reviews: 201,
            isNew: false,
            isSale: true,
            description: "The Royal Automatic is a masterpiece of horological excellence. Featuring an exhibition caseback that reveals the intricate automatic movement, this watch is as much a conversation piece as it is a precision timekeeping instrument.",
            features: [
                "Automatic Self-Winding",
                "Exhibition Caseback",
                "Sapphire Crystal",
                "Power Reserve 42 Hours",
                "Anti-Reflective Coating",
                "Skeleton Dial Design"
            ],
            specs: {
                caseMaterial: "316L Stainless Steel",
                caseSize: "44mm",
                dialColor: "Silver Skeleton",
                strapMaterial: "Stainless Steel Bracelet",
                movement: "Automatic",
                waterResistance: "100m",
                warranty: "3 Years International"
            }
        },
        {
            id: 4,
            name: "Vintage Heritage",
            price: 31999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.7,
            reviews: 56,
            isNew: true,
            isSale: false,
            description: "Inspired by the golden age of watchmaking, the Vintage Heritage pays homage to classic designs while incorporating modern technology. The aged brass accents and cream dial create a nostalgic yet refined aesthetic.",
            features: [
                "Vintage-Inspired Design",
                "Domed Crystal",
                "Cathedral Hands",
                "Aged Brass Accents",
                "See-Through Caseback",
                "Roman Numerals"
            ],
            specs: {
                caseMaterial: "Bronze & Steel",
                caseSize: "38mm",
                dialColor: "Cream",
                strapMaterial: "Distressed Leather",
                movement: "Swiss Automatic",
                waterResistance: "30m",
                warranty: "2 Years International"
            }
        },
        {
            id: 5,
            name: "Sport Titanium",
            price: 27999,
            originalPrice: 32999,
            image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.6,
            reviews: 178,
            isNew: false,
            isSale: true,
            description: "Engineered for the active lifestyle, the Sport Titanium is incredibly lightweight yet remarkably durable. The titanium construction is hypoallergenic and resistant to corrosion, making it the perfect companion for any adventure.",
            features: [
                "Grade 5 Titanium Case",
                "Rotating Bezel",
                "Super-LumiNova",
                "Screw-Down Crown",
                "Silicone Strap",
                "Chronograph Function"
            ],
            specs: {
                caseMaterial: "Titanium",
                caseSize: "43mm",
                dialColor: "Black",
                strapMaterial: "Silicone Rubber",
                movement: "Japanese Quartz Chrono",
                waterResistance: "200m",
                warranty: "2 Years International"
            }
        },
        {
            id: 6,
            name: "Executive Pro",
            price: 55999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.9,
            reviews: 92,
            isNew: false,
            isSale: false,
            description: "The Executive Pro is designed for those who demand excellence in every aspect of life. This premium timepiece features an 18K rose gold case and a sophisticated grey sunray dial that exudes luxury and refinement.",
            features: [
                "18K Rose Gold Case",
                "Sunray Dial Finish",
                "Swiss Automatic",
                "Alligator Leather Strap",
                "Folding Clasp",
                "Moon Phase Complication"
            ],
            specs: {
                caseMaterial: "18K Rose Gold",
                caseSize: "41mm",
                dialColor: "Grey Sunray",
                strapMaterial: "Alligator Leather",
                movement: "Swiss Automatic",
                waterResistance: "50m",
                warranty: "5 Years International"
            }
        },
        {
            id: 7,
            name: "Urban Steel",
            price: 15999,
            originalPrice: 19999,
            image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.5,
            reviews: 245,
            isNew: false,
            isSale: true,
            description: "Urban Steel brings contemporary style to your wrist. The minimalist design with a clean dial and mesh bracelet makes it versatile enough for both casual and formal occasions.",
            features: [
                "Minimalist Design",
                "Mesh Steel Bracelet",
                "Ultra-Thin Profile",
                "Japanese Movement",
                "Quick-Adjust Clasp",
                "Scratch-Resistant Crystal"
            ],
            specs: {
                caseMaterial: "Stainless Steel",
                caseSize: "39mm",
                dialColor: "White",
                strapMaterial: "Mesh Steel",
                movement: "Japanese Quartz",
                waterResistance: "30m",
                warranty: "2 Years International"
            }
        },
        {
            id: 8,
            name: "Carbon Noir",
            price: 38999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.8,
            reviews: 67,
            isNew: true,
            isSale: false,
            description: "The Carbon Noir represents cutting-edge materials science. The carbon fiber case is incredibly lightweight while being stronger than steel. The all-black aesthetic with red accents creates a bold, modern statement.",
            features: [
                "Carbon Fiber Case",
                "DLC Coated Bezel",
                "Red Accent Details",
                "Automatic Movement",
                "Kevlar Strap",
                "Anti-Magnetic"
            ],
            specs: {
                caseMaterial: "Carbon Fiber",
                caseSize: "45mm",
                dialColor: "Black with Red Accents",
                strapMaterial: "Kevlar",
                movement: "Swiss Automatic",
                waterResistance: "100m",
                warranty: "3 Years International"
            }
        },
    ],
    women: [
        {
            id: 1,
            name: "Rose Gold Elegance",
            price: 22999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1548169874-53e85f753f1e?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1548169874-53e85f753f1e?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.9,
            reviews: 156,
            isNew: true,
            isSale: false,
            description: "The Rose Gold Elegance is a celebration of feminine grace. The warm rose gold tones complement every skin tone, while the mother-of-pearl dial adds an ethereal quality to this stunning timepiece.",
            features: [
                "Rose Gold PVD Coating",
                "Mother-of-Pearl Dial",
                "Swarovski Crystal Markers",
                "Swiss Quartz Movement",
                "Jewelry Clasp",
                "Slim Profile Design"
            ],
            specs: {
                caseMaterial: "Rose Gold PVD Steel",
                caseSize: "32mm",
                dialColor: "Mother of Pearl",
                strapMaterial: "Mesh Rose Gold",
                movement: "Swiss Quartz",
                waterResistance: "30m",
                warranty: "2 Years International"
            }
        },
        {
            id: 2,
            name: "Diamond Luxe",
            price: 65999,
            originalPrice: 75999,
            image: "https://images.unsplash.com/photo-1612347519529-5b3e1e3d9b8c?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1612347519529-5b3e1e3d9b8c?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 5.0,
            reviews: 78,
            isNew: false,
            isSale: true,
            description: "Adorned with genuine diamonds, the Diamond Luxe is the epitome of luxury. Each stone is hand-set by master jewelers, creating a timepiece that sparkles with every movement.",
            features: [
                "Genuine Diamond Bezel",
                "Hand-Set Stones",
                "18K White Gold Case",
                "Swiss Automatic",
                "Sapphire Crystal",
                "Limited Edition"
            ],
            specs: {
                caseMaterial: "18K White Gold",
                caseSize: "28mm",
                dialColor: "Silver Diamond",
                strapMaterial: "Satin",
                movement: "Swiss Automatic",
                waterResistance: "30m",
                warranty: "5 Years International"
            }
        },
        {
            id: 3,
            name: "Pearl Classic",
            price: 28999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.8,
            reviews: 134,
            isNew: false,
            isSale: false,
            description: "The Pearl Classic features a genuine mother-of-pearl dial that showcases nature's artistry. Each dial is unique, with subtle iridescent patterns that shift in the light.",
            features: [
                "Genuine Mother-of-Pearl",
                "Roman Numeral Markers",
                "Slim Leather Strap",
                "Japanese Movement",
                "Crystal Accents",
                "Date Display"
            ],
            specs: {
                caseMaterial: "Stainless Steel",
                caseSize: "30mm",
                dialColor: "Iridescent Pearl",
                strapMaterial: "Leather",
                movement: "Japanese Quartz",
                waterResistance: "30m",
                warranty: "2 Years International"
            }
        },
        {
            id: 4,
            name: "Silver Petite",
            price: 16999,
            originalPrice: 21999,
            image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.7,
            reviews: 201,
            isNew: false,
            isSale: true,
            description: "Delicate and refined, the Silver Petite is designed for the modern minimalist. The compact case size and clean lines make it perfect for everyday elegance.",
            features: [
                "Petite 26mm Case",
                "Silver Sunray Dial",
                "Interchangeable Straps",
                "Japanese Movement",
                "Dainty Design",
                "Gift Box Included"
            ],
            specs: {
                caseMaterial: "Stainless Steel",
                caseSize: "26mm",
                dialColor: "Silver Sunray",
                strapMaterial: "Leather",
                movement: "Japanese Quartz",
                waterResistance: "30m",
                warranty: "2 Years International"
            }
        },
        {
            id: 5,
            name: "Sapphire Dream",
            price: 48999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1549972574-20eb06fac9cc?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1549972574-20eb06fac9cc?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.9,
            reviews: 89,
            isNew: true,
            isSale: false,
            description: "The Sapphire Dream features a stunning deep blue dial reminiscent of the ocean's depths. The sapphire accents around the bezel add a touch of precious beauty.",
            features: [
                "Sapphire Crystal Bezel",
                "Deep Blue Dial",
                "Swiss Movement",
                "Stainless Steel Case",
                "Blue Leather Strap",
                "Date Complication"
            ],
            specs: {
                caseMaterial: "Stainless Steel",
                caseSize: "34mm",
                dialColor: "Deep Blue",
                strapMaterial: "Blue Leather",
                movement: "Swiss Quartz",
                waterResistance: "50m",
                warranty: "3 Years International"
            }
        },
        {
            id: 6,
            name: "Velvet Night",
            price: 34999,
            originalPrice: 39999,
            image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.6,
            reviews: 112,
            isNew: false,
            isSale: true,
            description: "Velvet Night embodies sophisticated glamour. The deep black dial with starlight markers creates a celestial effect, while the velvet strap adds a luxurious tactile experience.",
            features: [
                "Starlight Markers",
                "Velvet Strap",
                "Black PVD Case",
                "Swiss Movement",
                "Crystal Crown",
                "Moon Phase"
            ],
            specs: {
                caseMaterial: "Black PVD Steel",
                caseSize: "32mm",
                dialColor: "Black Starlight",
                strapMaterial: "Velvet",
                movement: "Swiss Quartz",
                waterResistance: "30m",
                warranty: "2 Years International"
            }
        },
    ],
    couples: [
        {
            id: 1,
            name: "Eternal Bond Set",
            price: 45999,
            originalPrice: 54999,
            image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 5.0,
            reviews: 234,
            isNew: true,
            isSale: true,
            description: "The Eternal Bond Set celebrates love with a pair of perfectly matched timepieces. The his and hers designs share common elements while each maintaining their own character.",
            features: [
                "Matching Design Elements",
                "His & Hers Set",
                "Premium Gift Box",
                "Certificate of Authenticity",
                "Engraving Available",
                "Lifetime Service"
            ],
            specs: {
                caseMaterial: "Stainless Steel",
                caseSize: "40mm / 32mm",
                dialColor: "Champagne",
                strapMaterial: "Leather",
                movement: "Swiss Quartz",
                waterResistance: "50m",
                warranty: "Lifetime Limited"
            }
        },
        {
            id: 2,
            name: "Classic Duo",
            price: 38999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.8,
            reviews: 167,
            isNew: false,
            isSale: false,
            description: "Classic Duo offers timeless matching watches for couples who appreciate understated luxury. The matching white dials and silver cases create a harmonious pair.",
            features: [
                "Matching White Dials",
                "Silver Steel Cases",
                "Complementary Sizes",
                "Couple Gift Set",
                "Roman Numerals",
                "Date Display"
            ],
            specs: {
                caseMaterial: "316L Steel",
                caseSize: "42mm / 34mm",
                dialColor: "White",
                strapMaterial: "Steel Bracelet",
                movement: "Japanese Quartz",
                waterResistance: "50m",
                warranty: "3 Years"
            }
        },
        {
            id: 3,
            name: "Harmony Collection",
            price: 52999,
            originalPrice: 62999,
            image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.9,
            reviews: 98,
            isNew: false,
            isSale: true,
            description: "Harmony Collection represents the perfect union of masculine and feminine design. Each watch complements the other while maintaining individual character.",
            features: [
                "Yin & Yang Design",
                "Automatic Movement",
                "Exhibition Casebacks",
                "Luxury Presentation",
                "Matching Dials",
                "Sapphire Crystals"
            ],
            specs: {
                caseMaterial: "Stainless Steel",
                caseSize: "44mm / 36mm",
                dialColor: "Black & White",
                strapMaterial: "Leather",
                movement: "Automatic",
                waterResistance: "100m",
                warranty: "3 Years"
            }
        },
        {
            id: 4,
            name: "Royal Pair",
            price: 72999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 5.0,
            reviews: 145,
            isNew: true,
            isSale: false,
            description: "Royal Pair is our premium couples collection featuring rose gold accents and diamond markers. A statement of shared success and refined taste.",
            features: [
                "Rose Gold Accents",
                "Diamond Markers",
                "Premium Leather",
                "Swiss Movement",
                "Luxury Case",
                "VIP Service Card"
            ],
            specs: {
                caseMaterial: "Rose Gold PVD",
                caseSize: "41mm / 33mm",
                dialColor: "Rose Gold",
                strapMaterial: "Crocodile Leather",
                movement: "Swiss Automatic",
                waterResistance: "50m",
                warranty: "5 Years"
            }
        },
        {
            id: 5,
            name: "Timeless Together",
            price: 41999,
            originalPrice: 48999,
            image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.7,
            reviews: 189,
            isNew: false,
            isSale: true,
            description: "Timeless Together features minimalist designs that never go out of style. Perfect for couples who believe in enduring elegance.",
            features: [
                "Minimalist Design",
                "Matching Aesthetics",
                "Interchangeable Straps",
                "Gift Packaging",
                "Clean Dials",
                "Slim Profile"
            ],
            specs: {
                caseMaterial: "Stainless Steel",
                caseSize: "40mm / 32mm",
                dialColor: "Silver",
                strapMaterial: "Mesh Steel",
                movement: "Japanese Quartz",
                waterResistance: "30m",
                warranty: "2 Years"
            }
        },
        {
            id: 6,
            name: "Unity Gold",
            price: 59999,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=800",
            images: [
                "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=800",
            ],
            rating: 4.8,
            reviews: 76,
            isNew: false,
            isSale: false,
            description: "Unity Gold celebrates togetherness with matching gold-toned timepieces. The warm hues symbolize the precious nature of your bond.",
            features: [
                "Gold PVD Finish",
                "Matching Set",
                "Premium Gift Box",
                "Champagne Dials",
                "Date Function",
                "Automatic Movement"
            ],
            specs: {
                caseMaterial: "Gold PVD Steel",
                caseSize: "42mm / 34mm",
                dialColor: "Champagne",
                strapMaterial: "Gold Bracelet",
                movement: "Automatic",
                waterResistance: "50m",
                warranty: "3 Years"
            }
        },
    ],
};

const categoryTitles = {
    men: "Men's Collection",
    women: "Women's Collection",
    couples: "Couples Collection",
};

export default function ProductDetailPage({ params }) {
    const resolvedParams = use(params);
    const { category, id } = resolvedParams;
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState("description");

    // Find the product
    const watches = watchesData[category] || watchesData.men;
    const product = watches.find((w) => w.id === parseInt(id));

    if (!product) {
        return (
            <main className="min-h-screen bg-background pt-24 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-serif text-white mb-4">Product Not Found</h1>
                    <Link href={`/collection/${category}`} className="text-gold hover:text-gold-light">
                        ← Back to Collection
                    </Link>
                </div>
            </main>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <main className="min-h-screen bg-background pt-20">
            {/* Breadcrumb */}
            <div className="container mx-auto px-6 py-6">
                <nav className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link href={`/collection/${category}`} className="hover:text-gold transition-colors">
                        {categoryTitles[category]}
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-gold">{product.name}</span>
                </nav>
            </div>

            {/* Product Section */}
            <section className="container mx-auto px-6 pb-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Main Image */}
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-charcoal/30 mb-4">
                            {product.isNew && (
                                <span className="absolute top-4 left-4 z-10 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    New
                                </span>
                            )}
                            {product.isSale && (
                                <span className="absolute top-4 left-20 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    -{discount}%
                                </span>
                            )}
                            <Image
                                src={product.images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                                                ? "border-gold"
                                                : "border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} - View ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-gray-600"}
                                    />
                                ))}
                            </div>
                            <span className="text-gold font-medium">{product.rating}</span>
                            <span className="text-gray-400">({product.reviews} reviews)</span>
                        </div>

                        {/* Name */}
                        <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">{product.name}</h1>

                        {/* Price */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-gold">{formatPrice(product.price)}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                    <span className="bg-red-500/20 text-red-400 text-sm font-medium px-3 py-1 rounded-full">
                                        Save {discount}%
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 mb-8 leading-relaxed">{product.description}</p>

                        {/* Features Quick View */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {product.features.slice(0, 4).map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                                    <Check size={16} className="text-gold" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-white/20 rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-3 text-white hover:text-gold transition-colors"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="px-6 py-3 text-white font-medium min-w-[60px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-3 text-white hover:text-gold transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button className="flex-1 bg-gold text-black font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-gold-light transition-colors">
                                <ShoppingBag size={20} />
                                Add to Cart
                            </button>

                            {/* Wishlist */}
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`px-4 py-3 rounded-lg border transition-all ${isWishlisted
                                        ? "bg-gold border-gold text-black"
                                        : "border-white/20 text-white hover:border-gold hover:text-gold"
                                    }`}
                            >
                                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>

                            {/* Share */}
                            <button className="px-4 py-3 rounded-lg border border-white/20 text-white hover:border-gold hover:text-gold transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 p-6 bg-charcoal/30 rounded-xl border border-white/5">
                            <div className="flex flex-col items-center text-center">
                                <Truck size={24} className="text-gold mb-2" />
                                <span className="text-sm text-white font-medium">Free Delivery</span>
                                <span className="text-xs text-gray-400">On orders over Rs 10,000</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Shield size={24} className="text-gold mb-2" />
                                <span className="text-sm text-white font-medium">Warranty</span>
                                <span className="text-xs text-gray-400">{product.specs.warranty}</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <RotateCcw size={24} className="text-gold mb-2" />
                                <span className="text-sm text-white font-medium">Easy Returns</span>
                                <span className="text-xs text-gray-400">30-day return policy</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs Section */}
                <div className="mt-16">
                    {/* Tab Headers */}
                    <div className="flex border-b border-white/10 mb-8">
                        {["description", "specifications", "reviews"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm uppercase tracking-wider font-medium transition-colors relative ${activeTab === tab
                                        ? "text-gold"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-charcoal/20 rounded-xl p-8 border border-white/5"
                    >
                        {activeTab === "description" && (
                            <div>
                                <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>
                                <h4 className="text-white font-serif text-xl mb-4">Key Features</h4>
                                <ul className="grid md:grid-cols-2 gap-3">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3 text-gray-300">
                                            <Check size={18} className="text-gold flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === "specifications" && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {Object.entries(product.specs).map(([key, value]) => (
                                    <div key={key} className="flex justify-between py-3 border-b border-white/10">
                                        <span className="text-gray-400 capitalize">
                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                        <span className="text-white font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="text-center py-12">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={32}
                                            className={i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-gray-600"}
                                        />
                                    ))}
                                </div>
                                <p className="text-3xl font-serif text-white mb-2">{product.rating} out of 5</p>
                                <p className="text-gray-400 mb-8">Based on {product.reviews} reviews</p>
                                <button className="bg-gold text-black font-semibold py-3 px-8 rounded-lg hover:bg-gold-light transition-colors">
                                    Write a Review
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
