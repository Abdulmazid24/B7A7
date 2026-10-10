import type { MetadataRoute } from "next";
import { UNIVERSITY_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${UNIVERSITY_NAME} Academic Portal`,
    short_name: "Apex UMS",
    description: "Next.js Enterprise University Management System with role-based dashboards",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
