'use client';

import React from 'react';

interface StructuredDataProps {
  data: object | object[];
}

/**
 * Renders one or more JSON-LD structured-data blocks into <head>.
 * Used by pages to inject Organization, WebSite, Product, BreadcrumbList,
 * FAQPage and ItemList schemas that Google, Bing & Pinterest can read.
 *
 * data can be a single schema object or an array of schemas.
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const scripts = Array.isArray(data) ? data : [data];

  return (
    <>
      {scripts.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};
