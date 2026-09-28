import { ImageResponse } from "next/og";
import { SquareSocialCard } from "./social-card";

export const alt = "Senda Nativa, juego educativo de sumas y restas con animales del Uruguay";
export const size = { width: 1200, height: 1200 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(<SquareSocialCard />, size);
}
