"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Só anima quem não pediu movimento reduzido ao sistema. */
export const COM_MOVIMENTO = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };
