"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart,
  Eye, ArrowUpRight, Star, Clock,
} from "lucide-react";
import { watchesData } from "@/lib/products";

/* ── helpers ─────────────────────────────────────────────── */
function formatPrice(v) {
  return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", minimumFractionDigits: 0 }).format(v);
}

function allProducts() {
  return Object.entries(watchesData).flatMap(([cat, items]) =>
    items.map((p) => ({ ...p, category: cat }))
  );
}

/* ── mock analytics derived from real catalog ────────────── */
function useAnalytics() {
  const products = allProducts();
  const totalProducts = products.length;
  const totalRevenue = products.reduce((s, p) => s + p.price * (Math.floor(Math.random() * 8) + 1), 0);
  const totalOrders = 847;
  const avgRating = (products.reduce((s, p) => s + p.rating, 0) / totalProducts).toFixed(1);

  const monthlySales = [42, 58, 35, 71, 63, 89, 76, 95, 83, 102, 91, 118];
  const monthlyRevenue = [1.2, 1.7, 1.0, 2.1, 1.8, 2.6, 2.2, 2.8, 2.4, 3.0, 2.7, 3.5];
  const categoryBreakdown = [
    { label: "Men", count: watchesData.men.length, color: "#d4af37", pct: 40 },
    { label: "Women", count: watchesData.women.length, color: "#a78bfa", pct: 30 },
    { label: "Couples", count: watchesData.couples.length, color: "#34d399", pct: 30 },
  ];

  const topSelling = products.sort((a, b) => b.reviews - a.reviews).slice(0, 5);

  const recentOrders = [
    { id: "KW-0001", customer: "Ahmed K.", product: "Chronograph Elite", total: 24999, status: "delivered" },
    { id: "KW-0002", customer: "Sara A.", product: "Rose Gold Elegance", total: 22999, status: "shipped" },
    { id: "KW-0003", customer: "Hassan R.", product: "Eternal Bond Set", total: 45999, status: "processing" },
    { id: "KW-0004", customer: "Fatima N.", product: "Diamond Luxe", total: 65999, status: "pending" },
    { id: "KW-0005", customer: "Bilal S.", product: "Royal Automatic", total: 42999, status: "delivered" },
  ];

  return { totalProducts, totalRevenue, totalOrders, avgRating, monthlySales, monthlyRevenue, categoryBreakdown, topSelling, recentOrders };
}

/* ── mini bar chart (pure canvas) ────────────────────────── */
function BarChart({ data, labels, color = "#d4af37", height = 200 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const max = Math.max(...data) * 1.15;
    const barW = (w - 60) / data.length - 6;
    const startX = 40;

    // grid lines
    for (let i = 0; i <= 4; i++) {
      const y = 10 + ((h - 40) / 4) * i;
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.round(max - (max / 4) * i), startX - 6, y + 4);
    }

    // bars
    data.forEach((v, i) => {
      const barH = (v / max) * (h - 50);
      const x = startX + i * (barW + 6) + 3;
      const y = h - 30 - barH;
      const grad = ctx.createLinearGradient(x, y, x, h - 30);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + "33");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      // label
      if (labels?.[i]) {
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(labels[i], x + barW / 2, h - 12);
      }
    });
  }, [data, labels, color, height]);

  return <canvas ref={canvasRef} className="w-full" style={{ height }} />;
}

/* ── line chart (pure canvas) ────────────────────────────── */
function LineChart({ data, labels, color = "#d4af37", height = 200 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const max = Math.max(...data) * 1.2;
    const startX = 40;
    const endX = w - 20;
    const stepX = (endX - startX) / (data.length - 1);

    // grid
    for (let i = 0; i <= 4; i++) {
      const y = 10 + ((h - 40) / 4) * i;
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText((max - (max / 4) * i).toFixed(1) + "M", startX - 4, y + 4);
    }

    // area fill
    const points = data.map((v, i) => ({
      x: startX + i * stepX,
      y: 10 + (1 - v / max) * (h - 40),
    }));
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, h - 30);
    ctx.lineTo(points[0].x, h - 30);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + "30");
    grad.addColorStop(1, color + "05");
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // dots & labels
    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#060606";
      ctx.fill();
      if (labels?.[i]) {
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(labels[i], p.x, h - 12);
      }
    });
  }, [data, labels, color, height]);

  return <canvas ref={canvasRef} className="w-full" style={{ height }} />;
}

/* ── donut chart (pure canvas) ───────────────────────────── */
function DonutChart({ segments, size = 180 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    c.width = size * dpr;
    c.height = size * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2, cy = size / 2, r = size / 2 - 12, lw = 24;
    const total = segments.reduce((s, seg) => s + seg.pct, 0);
    let angle = -Math.PI / 2;

    segments.forEach((seg) => {
      const sweep = (seg.pct / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, angle, angle + sweep);
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = lw;
      ctx.lineCap = "round";
      ctx.stroke();
      angle += sweep + 0.04;
    });

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(segments.reduce((s, seg) => s + seg.count, 0), cx, cy + 2);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Products", cx, cy + 18);
  }, [segments, size]);

  return <canvas ref={canvasRef} width={size} height={size} style={{ width: size, height: size }} />;
}

/* ── KPI card ────────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, change, positive, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-gold/20 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
          <Icon size={22} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${positive ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </motion.div>
  );
}

/* ── status badge ────────────────────────────────────────── */
const statusMap = {
  delivered: { cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", lbl: "Delivered" },
  shipped: { cls: "text-purple-400 bg-purple-400/10 border-purple-400/20", lbl: "Shipped" },
  processing: { cls: "text-blue-400 bg-blue-400/10 border-blue-400/20", lbl: "Processing" },
  pending: { cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", lbl: "Pending" },
};

/* ── main component ──────────────────────────────────────── */
export default function DashboardContent() {
  const a = useAnalytics();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back — here&apos;s your store overview.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KpiCard icon={DollarSign} label="Total Revenue" value={formatPrice(a.totalRevenue)} change="+18.2%" positive delay={0} />
        <KpiCard icon={ShoppingCart} label="Total Orders" value={a.totalOrders.toLocaleString()} change="+12.5%" positive delay={0.05} />
        <KpiCard icon={Package} label="Total Products" value={a.totalProducts} change="+3" positive delay={0.1} />
        <KpiCard icon={Star} label="Avg. Rating" value={a.avgRating} change="+0.2" positive delay={0.15} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Monthly Sales</h3>
              <p className="text-sm text-gray-500">Units sold per month</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
              <TrendingUp size={14} /> +23%
            </div>
          </div>
          <BarChart data={a.monthlySales} labels={months} color="#d4af37" height={220} />
        </motion.div>

        {/* Revenue Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
              <p className="text-sm text-gray-500">Monthly revenue (PKR millions)</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
              <TrendingUp size={14} /> +29%
            </div>
          </div>
          <LineChart data={a.monthlyRevenue} labels={months} color="#a78bfa" height={220} />
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-white self-start mb-6">Category Breakdown</h3>
          <DonutChart segments={a.categoryBreakdown} size={160} />
          <div className="flex gap-6 mt-6">
            {a.categoryBreakdown.map((seg) => (
              <div key={seg.label} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ background: seg.color }} />
                <span className="text-gray-400">{seg.label}</span>
                <span className="text-white font-medium">{seg.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Selling */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Selling</h3>
          <div className="space-y-4">
            {a.topSelling.map((p, i) => (
              <div key={`${p.category}-${p.id}`} className="flex items-center gap-4">
                <span className="w-7 h-7 rounded-lg bg-gold/10 text-gold text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gold font-medium">{formatPrice(p.price)}</p>
                  <p className="text-xs text-gray-500">{p.reviews} reviews</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {a.recentOrders.map((o) => {
              const s = statusMap[o.status];
              return (
                <div key={o.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white text-xs font-bold">
                    {o.customer.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{o.customer}</p>
                    <p className="text-xs text-gray-500 truncate">{o.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white font-medium">{formatPrice(o.total)}</p>
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${s.cls}`}>{s.lbl}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
