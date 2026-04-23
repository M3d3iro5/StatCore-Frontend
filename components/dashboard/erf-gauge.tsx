"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getERFColor, getERFStatus, getERFLabel } from "@/lib/mock-data";

interface ERFGaugeProps {
  value: number;
}

export function ERFGauge({ value }: ERFGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setAnimatedValue(eased * value);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [value]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 280;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = 110;
    const lineWidth = 16;

    // Background colors from CSS - detect dark mode
    const isDark = document.documentElement.classList.contains("dark");
    const trackColor = isDark ? "#1E293B" : "#E2E8F0";

    ctx.clearRect(0, 0, size, size);

    // Start angle from bottom-left (-210 deg) to bottom-right (30 deg)
    const startAngle = (Math.PI * 3) / 4;
    const endAngle = (Math.PI * 9) / 4 - Math.PI / 4;
    const totalArc = endAngle - startAngle;

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = trackColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    // Red zone (0.8-1.0)
    const redStart = startAngle + totalArc * 0.8;
    const redEnd = endAngle;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, redStart, redEnd);
    ctx.strokeStyle = "#EF444430";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    // Yellow zone (0.6-0.8)
    const yellowStart = startAngle + totalArc * 0.6;
    const yellowEnd = redStart;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, yellowStart, yellowEnd);
    ctx.strokeStyle = "#F59E0B30";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "butt";
    ctx.stroke();

    // Green zone (0-0.6)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, yellowStart);
    ctx.strokeStyle = "#10B98130";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    // Value arc
    const valueEnd = startAngle + totalArc * animatedValue;
    const erfColor = getERFColor(animatedValue);

    // Glow
    ctx.save();
    ctx.shadowColor = erfColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, valueEnd);
    ctx.strokeStyle = erfColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const angle = startAngle + (totalArc * i) / 10;
      const innerR = radius - lineWidth / 2 - 6;
      const outerR = radius - lineWidth / 2 - (i % 5 === 0 ? 14 : 10);
      const tickColor = isDark ? "#475569" : "#94A3B8";

      ctx.beginPath();
      ctx.moveTo(cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle));
      ctx.lineTo(cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle));
      ctx.strokeStyle = tickColor;
      ctx.lineWidth = i % 5 === 0 ? 2 : 1;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Scale labels
    const textColor = isDark ? "#94A3B8" : "#64748B";
    ctx.font = "11px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColor;

    const labels = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
    labels.forEach((label) => {
      const angle = startAngle + totalArc * label;
      const labelR = radius - lineWidth / 2 - 24;
      const x = cx + labelR * Math.cos(angle);
      const y = cy + labelR * Math.sin(angle);
      ctx.fillText(label.toFixed(1), x, y);
    });
  }, [animatedValue]);

  const erfColor = getERFColor(animatedValue);
  const erfStatus = getERFStatus(animatedValue);
  const erfLabel = getERFLabel(animatedValue);

  return (
    <Card
      className="overflow-hidden border-border/50 bg-card animate-fade-in-up"
      style={{ animationDelay: "400ms" }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Indicador de Integridade ERF
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-6">
        <div className="relative">
          <canvas ref={canvasRef} className="h-[280px] w-[280px]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <span
              className="font-mono text-5xl font-bold tabular-nums"
              style={{ color: erfColor }}
            >
              {animatedValue.toFixed(2)}
            </span>
            <span
              className="mt-1 rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: `${erfColor}20`, color: erfColor }}
            >
              {erfStatus}
            </span>
          </div>
        </div>
        <div className="mt-2 flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-medium text-foreground">{erfLabel}</p>
          <p className="text-xs text-muted-foreground">
            Monitoramento recomendado em 30 dias
          </p>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
            <span>{"\u2265 0.8 Critico"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
            <span>0.6-0.8</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
            <span>{"< 0.6 Seguro"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
