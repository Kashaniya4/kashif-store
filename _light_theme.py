import os, re, glob

ROOT = r"C:\Users\REHMAN BABA\OneDrive\Desktop\store\src"

# Mapping of dark -> light Tailwind classes (longest/most specific first)
MAP = [
    # Gradients first (most specific)
    ("bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950", "bg-gradient-to-r from-slate-100 via-white to-slate-100"),
    ("from-slate-950 via-slate-900 to-slate-950", "from-slate-100 via-white to-slate-100"),
    ("bg-slate-950/90", "bg-white/90"),
    ("bg-slate-950/95", "bg-white/95"),
    ("bg-slate-950/70", "bg-white/70"),
    ("bg-slate-950/60", "bg-white/60"),
    ("bg-slate-950/40", "bg-white/40"),
    ("bg-slate-950/80", "bg-white/80"),
    ("bg-slate-900/90", "bg-white/90"),
    ("bg-slate-900/80", "bg-white/80"),
    ("bg-slate-900/70", "bg-white/70"),
    ("bg-slate-900/60", "bg-white/60"),
    ("bg-slate-900/50", "bg-white/50"),
    ("bg-slate-900/40", "bg-white/40"),
    ("bg-slate-800/90", "bg-slate-100/90"),
    ("bg-slate-800/80", "bg-slate-100/80"),
    ("bg-slate-900", "bg-white"),
    ("bg-slate-950", "bg-slate-50"),
    ("bg-slate-800", "bg-slate-100"),
    ("bg-slate-700", "bg-slate-200"),
    # borders
    ("border-slate-800/80", "border-slate-200"),
    ("border-slate-800", "border-slate-200"),
    ("border-slate-700", "border-slate-300"),
    ("divide-slate-800", "divide-slate-200"),
    ("divide-slate-700", "divide-slate-300"),
    # text
    ("text-slate-100", "text-slate-900"),
    ("text-slate-200", "text-slate-800"),
    ("text-slate-300", "text-slate-700"),
    ("text-slate-400", "text-slate-600"),
    ("text-white", "text-slate-900"),
    ("placeholder-slate-400", "placeholder-slate-500"),
    ("placeholder-slate-500", "placeholder-slate-400"),
    ("placeholder-slate-600", "placeholder-slate-400"),
    # scrollbar dark accents in classNames are handled in globals.css separately
    # ring / focus accents
    ("ring-slate-800", "ring-slate-200"),
    # accent text on dark -> keep emerald/rose/amber but they work on light too
    # solid emerald text on light needs darkening slightly: keep as is (emerald-600 better)
    ("text-emerald-400", "text-emerald-600"),
    ("hover:text-emerald-400", "hover:text-emerald-600"),
    ("hover:text-emerald-300", "hover:text-emerald-700"),
    ("text-emerald-300", "text-emerald-700"),
    ("text-emerald-200", "text-emerald-700"),
    ("text-amber-400", "text-amber-600"),
    ("hover:text-amber-400", "hover:text-amber-600"),
    ("text-amber-300", "text-amber-600"),
    ("text-amber-200", "text-amber-700"),
    ("text-rose-400", "text-rose-600"),
    ("hover:text-rose-400", "hover:text-rose-600"),
    ("text-rose-500", "text-rose-600"),
    ("text-cyan-300", "text-cyan-700"),
    ("text-sky-400", "text-sky-600"),
    ("text-purple-400", "text-purple-600"),
    ("text-slate-950", "text-slate-50"),
    ("text-slate-950", "text-slate-50"),
    # borders accent dark->light readable
    ("border-emerald-500/50", "border-emerald-600/50"),
    ("border-emerald-500/30", "border-emerald-600/40"),
    ("border-emerald-500/20", "border-emerald-600/30"),
    ("border-rose-900", "border-rose-200"),
    ("border-emerald-800", "border-emerald-300"),
    ("bg-emerald-800", "bg-emerald-700"),
    ("bg-rose-950/40", "bg-rose-50"),
    ("bg-rose-950/70", "bg-rose-100"),
    ("bg-rose-950", "bg-rose-50"),
    ("bg-amber-950/80", "bg-amber-100"),
    ("bg-amber-800", "bg-amber-700"),
    ("bg-sky-950/80", "bg-sky-100"),
    ("bg-emerald-950/80", "bg-emerald-50"),
    ("bg-purple-950/80", "bg-purple-100"),
    ("bg-slate-950/95", "bg-white/95"),
    ("hover:bg-slate-950", "hover:bg-slate-100"),
    ("bg-black/50", "bg-slate-900/40"),
    ("bg-black/60", "bg-slate-900/40"),
    ("bg-black/70", "bg-slate-900/50"),
]

changed_files = []
for path in glob.glob(os.path.join(ROOT, "**", "*.tsx"), recursive=True):
    with open(path, "r", encoding="utf-8") as f:
        src = f.read()
    orig = src
    for old, new in MAP:
        src = src.replace(old, new)
    if src != orig:
        with open(path, "w", encoding="utf-8") as f:
            f.write(src)
        changed_files.append(os.path.relpath(path, ROOT))

print(f"Changed {len(changed_files)} files:")
for f in changed_files:
    print(" -", f)
