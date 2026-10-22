import type { MetadataRoute } from "next";
import { UNIVERSITY_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${UNIVERSITY_NAME} Academic Portal`,
    short_name: "Metropolitan UMS",
    description: "University Management System demo with role based academic workspaces.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#1e1b4b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32 48x48",
        type: "image/x-icon",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
