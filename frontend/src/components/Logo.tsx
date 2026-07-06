/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  theme?: 'light' | 'dark';
  showText?: boolean;
  className?: string; // e.g. "h-10 w-auto"
}

export default function Logo({ theme = 'dark', showText = true, className = "h-10" }: LogoProps) {
  // Determine colors based on light vs dark theme
  const isLight = theme === 'light';
  const primaryTextColor = isLight ? '#0f172a' : '#ffffff'; // Slate-900 vs White
  const accentColor = isLight ? '#2563eb' : '#00f0ff'; // Blue-600 vs Cyan
  const separatorColor = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)'; // Slate-200 vs White/15

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox={showText ? "0 0 260 70" : "0 0 95 70"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <defs>
          {/* Vibrant blue to cyan gradient for the 'S' and Orbit swooshes */}
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" /> {/* Cyan */}
            <stop offset="100%" stopColor="#0062ff" /> {/* Royal Blue */}
          </linearGradient>
          
          <linearGradient id="swooshGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0052ff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00d8ff" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.9" />
          </linearGradient>

          {/* Glow filter for tech-style branding */}
          <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- GS ICON PORTION --- */}
        {/* Orbital Ring - BACK SECTION (draw before letters for 3D overlap effect) */}
        <path
          d="M 12 56 C 2 48, 8 36, 26 30 C 38 26, 52 26, 68 31"
          stroke="url(#swooshGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* 'G' - Bold Display Letter */}
        <text
          x="10"
          y="52"
          fontFamily="'Inter', system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="48"
          fontStyle="italic"
          fill={primaryTextColor}
          className="transition-colors duration-300 animate-pulse-slow"
          letterSpacing="-1"
        >
          G
        </text>

        {/* 'S' - Futuristic Gradient Letter */}
        <text
          x="44"
          y="52"
          fontFamily="'Inter', system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="48"
          fontStyle="italic"
          fill="url(#blueGradient)"
          letterSpacing="-1"
        >
          S
        </text>

        {/* Orbital Ring - FRONT SECTION (sweeps around letters) */}
        <path
          d="M 3 48 C 3 60, 32 64, 60 52 C 78 44, 91 32, 91 22"
          stroke="url(#blueGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#logoGlow)"
        />
        
        {/* Secondary thinner orbit reflection line */}
        <path
          d="M 10 49 C 14 57, 34 59, 58 49 C 72 43, 83 33, 83 25"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />

        {showText && (
          <>
            {/* --- VERTICAL SEPARATOR LINE --- */}
            <line
              x1="102"
              y1="12"
              x2="102"
              y2="58"
              stroke={separatorColor}
              className="transition-colors duration-300"
              strokeWidth="1"
            />

            {/* --- WORDMARK: "GLOBAL SERVICE" --- */}
            {/* "GLOBAL" */}
            <text
              x="114"
              y="34"
              fontFamily="'Inter', system-ui, -apple-system, sans-serif"
              fontWeight="800"
              fontSize="24"
              letterSpacing="2"
              fill={primaryTextColor}
              className="transition-colors duration-300"
            >
              GLOBAL
            </text>

            {/* "— SERVICE —" */}
            {/* Left Accent line */}
            <line
              x1="114"
              y1="49"
              x2="132"
              y2="49"
              stroke={accentColor}
              className="transition-colors duration-300"
              strokeWidth="2"
            />

            {/* "SERVICE" Text */}
            <text
              x="176"
              y="53"
              fontFamily="'Inter', system-ui, -apple-system, sans-serif"
              fontWeight="700"
              fontSize="12.5"
              letterSpacing="5.5"
              fill={accentColor}
              className="font-bold text-glow-cyan"
              textAnchor="middle"
            >
              SERVICE
            </text>

            {/* Right Accent line */}
            <line
              x1="220"
              y1="49"
              x2="238"
              y2="49"
              stroke={accentColor}
              className="transition-colors duration-300"
              strokeWidth="2"
            />
          </>
        )}
      </svg>
    </div>
  );
}
