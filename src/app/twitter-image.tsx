import { ImageResponse } from "next/og";
import { SocialCard } from "./social-card";

export const alt = "Senda Nativa, juego educativo para recorrer Uruguay y practicar matemática";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<SocialCard />, size);
}
