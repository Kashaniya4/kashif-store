'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types/store';
import {
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Trash2,
  Package
} from 'lucide-react';

export default function JsonImporterPage() {
  const { products, importProducts } = useStore();

  const [jsonInput, setJsonInput] = useState('');
  const [parsedProducts, setParsedProducts] = useState<Product[] | null>(null);
  const [parseError, setParseError] = useState('');
  const [isImported, setIsImported] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setJsonInput(ev.target.result);
      }
    };
    reader.readAsText(file);
  };

  const validateProducts = (data: unknown): Product[] => {
    if (!Array.isArray(data)) {
      throw new Error('Expected a JSON array of products.');
    }

    return data.map((item, index) => {
      if (!item || typeof item !== 'object') {
        throw new Error(`Item ${index + 1}: Must be an object.`);
      }
      const p = item as Record<string, unknown>;

      const required: Array<[string, string]> = [
        ['id', 'string'],
        ['name', 'string'],
        ['price', 'number'],
        ['category', 'string'],
        ['description', 'string'],
        ['image', 'string'],
        ['stock', 'number'],
      ];

      for (const [field, type] of required) {
        if (typeof p[field] !== type) {
          throw new Error(`Item ${index + 1} ("${p.name || 'unknown'}"): Field "${field}" must be a ${type}.`);
        }
      }

      return {
        id: p.id as string,
        name: p.name as string,
        slug: (p.slug as string) || String(p.id),
        price: p.price as number,
        originalPrice: p.originalPrice as number | undefined,
        category: p.category as string,
        rating: (p.rating as number) ?? 5,
        reviewsCount: (p.reviewsCount as number) ?? 0,
        stock: p.stock as number,
        isFeatured: p.isFeatured as boolean | undefined,
        description: p.description as string,
        image: p.image as string,
        specs: (p.specs as Record<string, string>) || {},
        tags: Array.isArray(p.tags) ? p.tags as string[] : [],
      };
    });
  };

  const handleParse = () => {
    setParseError('');
    setIsImported(false);
    try {
      const data = JSON.parse(jsonInput);
      const validated = validateProducts(data);
      setParsedProducts(validated);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Invalid JSON.');
      setParsedProducts(null);
    }
  };

  const handleImport = () => {
    if (!parsedProducts) return;
    importProducts(parsedProducts);
    setIsImported(true);
    setParsedProducts(null);
    setJsonInput('');
  };

  const existingIds = new Set(products.map(p => p.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Logistics Admin</span>
          </Link>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-400" />
            <span>Instant JSON Product Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Paste or upload a JSON array of products — validated and merged into the live store instantly.
          </p>
        </div>
        <div className="text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-slate-300">
          <span className="text-slate-500">Current Catalog:</span>{' '}
          <strong className="text-emerald-400">{products.length} products</strong>
        </div>
      </div>

      {/* Success Toast */}
      {isImported && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Products imported successfully into the live catalog! 🎉</span>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">

        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Product JSON Data</span>
          </h3>
          <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer transition flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload .json File</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <textarea
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          rows={12}
          spellCheck={false}
          placeholder={`Paste your product JSON here...\n\nExample:\n[\n  {\n    "id": "prod-100",\n    "name": "Premium Wireless Mouse",\n    "price": 2999,\n    "originalPrice": 3999,\n    "category": "Electronics & Audio",\n    "rating": 4.7,\n    "reviewsCount": 23,\n    "stock": 50,\n    "isFeatured": false,\n    "description": "Ergonomic wireless mouse with silent clicks.",\n    "image": "https://images.unsplash.com/photo-...",\n    "specs": { "Connection": "2.4GHz Wireless", "Battery": "12 Months" },\n    "tags": ["Mouse", "Wireless", "Accessories"]\n  }\n]`}
          className="w-full bg-slate-950 text-emerald-300 text-xs font-mono rounded-xl p-4 border border-slate-800 focus:outline-none focus:border-emerald-500 resize-y placeholder:text-slate-600"
        />

        <div className="flex gap-3">
          <button
            onClick={handleParse}
            disabled={!jsonInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Validate & Preview
          </button>
          {parsedProducts && (
            <button
              onClick={handleImport}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import {parsedProducts.length} Products</span>
            </button>
          )}
        </div>

        {/* Parse Error */}
        {parseError && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-start gap-2">
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{parseError}</span>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {parsedProducts && parsedProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>Preview — {parsedProducts.length} products</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {parsedProducts.map((p, i) => {
              const exists = existingIds.has(p.id);
              return (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative">
                  {exists && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-700 px-2 py-0.5 rounded-full">
                      Existing ID — will update
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-950"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold">₨ {p.price.toLocaleString()}</span>
                    <span className="text-slate-500">{p.stock} in stock</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{p.description}</div>
                </div>
              );
            })}
          </div>

          {/* Missing fields warning */}
          {parsedProducts.some(p => p.specs === undefined || p.tags === undefined) && (
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Some products are missing optional fields (specs/tags) — they will be added with empty values.</span>
            </div>
          )}
        </div>
      )}

      {/* Sample template */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Product Schema Reference
          </span>
          <button
            onClick={() => {
              setJsonInput(JSON.stringify([
                {
                  id: "prod-sample",
                  name: "Sample Product",
                  price: 1499,
                  category: "General",
                  stock: 10,
                  description: "A sample product from the importer.",
                  image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=60",
                  specs: { "Color": "Black" },
                  tags: ["Sample"]
                }
              ], null, 2));
            }}
            className="text-emerald-400 hover:text-emerald-300 font-bold"
          >
            Load Sample
          </button>
        </div>
        <div className="text-slate-500 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto">
          {`Required: id, name, price, category, description, image, stock`}
          <br />
          {`Optional: originalPrice, rating, reviewsCount, isFeatured, specs, tags`}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" /> Live Catalog Size
          </div>
          <div className="text-2xl font-black text-white">{products.length}</div>
          <div className="text-[11px] text-slate-500">Products currently active in store</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Categories
          </div>
          <div className="text-2xl font-black text-white">
            {new Set(products.map(p => p.category)).size}
          </div>
          <div className="text-[11px] text-slate-500">Distinct product categories</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-emerald-400" /> Persistence
          </div>
          <div className="text-sm font-black text-white">localStorage</div>
          <div className="text-[11px] text-slate-500">Imports survive page reloads</div>
        </div>
      </div>

    </div>
  );
}
