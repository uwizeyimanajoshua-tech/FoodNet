import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({ title, description, keywords, image, url }: SEOProps) {
  useEffect(() => {
    // 1. Set title
    const formattedTitle = `${title} | FoodNet Kirehe`;
    document.title = formattedTitle;

    // 2. Helper to set/update meta tags
    const updateMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 3. Update standard search engine optimizations
    updateMetaTag("name", "description", description);
    updateMetaTag("name", "keywords", keywords || "Kirehe, Kirehe Food, Rwanda Food, Isombe, Akabenz, Kigali Food, Rwanda Culinary, FoodNet");

    // 4. Update OpenGraph (OG) elements for rich messenger previews (WhatsApp, Twitter, FB)
    updateMetaTag("property", "og:title", formattedTitle);
    updateMetaTag("property", "og:description", description);
    updateMetaTag("property", "og:type", "website");
    updateMetaTag("property", "og:url", url || window.location.href);
    if (image) {
      updateMetaTag("property", "og:image", image);
    }

    // 5. Update Twitter Cards
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", formattedTitle);
    updateMetaTag("name", "twitter:description", description);
    if (image) {
      updateMetaTag("name", "twitter:image", image);
    }
  }, [title, description, keywords, image, url]);

  return null;
}
