#!/usr/bin/env python3
"""
Updates all protocol sub-pages to use design system classes:
- Replaces section-hero with section-gradient-blue
- Adds mesh-bg overlay
- Wraps content in RevealSection
- Adds eyebrow label
- Converts stat display to glass-panel pill
- Wraps grid and CTA sections in RevealSection
- Adds RevealSection import if missing
"""
import os
import re

PROTOCOLS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app", "protocols")

# Mapping of page path -> (eyebrow_label, stat_count, stat_label)
PAGE_META = {
    "bridges": ("Category", "15+", "Bridge Protocols Listed"),
    "gaming": ("Category", "20+", "Games & GameFi Listed"),
    "nft": ("Category", "15+", "NFT Protocols Listed"),
    "liquid-staking": ("Category", "12+", "Liquid Staking Protocols"),
    "perps": ("Category", "12+", "Perp Protocols Listed"),
    "oracles": ("Category", "7+", "Oracle Protocols Listed"),
    "socialfi": ("Category", "12+", "SocialFi Protocols Listed"),
    "rwa": ("Category", "10+", "RWA Protocols Listed"),
    "depin": ("Category", "8+", "DePIN Protocols Listed"),
    "ai-agents": ("Category", "12+", "AI Agent Protocols Listed"),
    "btc-primitives": ("Category", "10+", "BTC Protocols Listed"),
    "identity": ("Category", "10+", "Identity Protocols Listed"),
    "launchpads": ("Category", "6+", "Launchpad Protocols Listed"),
    "storage": ("Category", "10+", "Storage Protocols Listed"),
    "hardware-wallets": ("Category", "8+", "Hardware Wallet Solutions"),
    "prediction-markets": ("Category", "8+", "Prediction Protocols Listed"),
}

def add_reveal_import(content):
    if "RevealSection" in content:
        return content
    # Add import after other imports
    content = content.replace(
        'import { Button } from "@/components/ui/button"',
        'import { Button } from "@/components/ui/button"\nimport { RevealSection } from "@/components/reveal-section"'
    )
    return content

def transform_hero_section(content, eyebrow, stat_count, stat_label):
    # Pattern: find the old hero section
    old_hero_pattern = re.compile(
        r'<section className="section-hero container-modern relative overflow-hidden">\s*'
        r'<div className="absolute inset-0 pointer-events-none">\s*'
        r'<div className="absolute top-0 left-1/2 -translate-x-1/2 w-\[600px\] h-\[300px\] bg-\[#2B7FFF\]/12 rounded-full blur-3xl" />\s*'
        r'</div>\s*'
        r'(<div className="space-y-6 text-center relative z-10">)(.*?)(</div>\s*</section>)',
        re.DOTALL
    )
    
    def replace_hero(m):
        inner_div_open = m.group(1)
        inner_content = m.group(2)
        
        # Extract existing h1 text
        h1_match = re.search(r'<h1 className="heading-hero">(.*?)</h1>', inner_content, re.DOTALL)
        h1_text = h1_match.group(1) if h1_match else ""
        
        # Extract subtitle
        subtitle_match = re.search(r'<p className="text-subtitle mx-auto max-w-2xl">(.*?)</p>', inner_content, re.DOTALL)
        subtitle_text = subtitle_match.group(1) if subtitle_match else ""
        
        new_section = f'''<section className="section-gradient-blue container-modern relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
          <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
          <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">{eyebrow}</p>
          <h1 className="heading-hero">{h1_text}</h1>
          <p className="text-subtitle mx-auto max-w-2xl">{subtitle_text}</p>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
            <span className="text-gradient font-bold text-xl">{stat_count}</span>
            <span className="text-muted-foreground">{stat_label}</span>
          </div>
          </RevealSection>
        </div>
      </section>'''
        return new_section
    
    return old_hero_pattern.sub(replace_hero, content)

def wrap_grid_and_cta_sections(content):
    # Wrap grid section
    content = re.sub(
        r'(<section className="section-default container-modern">\s*)'
        r'(<ProtocolGrid[^/]*/>\s*)'
        r'(</section>)',
        r'\1<RevealSection delay={100}>\n          \2\n        </RevealSection>\n      \3',
        content,
        count=1
    )
    # Wrap CTA section  
    content = re.sub(
        r'(<section className="section-default container-modern">\s*)'
        r'(<div className="card-modern-blue)',
        r'\1<RevealSection delay={200}>\n          \2',
        content,
        count=1
    )
    content = re.sub(
        r'(</div>\s*</section>\s*</main>)',
        r'</RevealSection>\n        </section>\n    </main>',
        content,
        count=1
    )
    return content

def process_file(filepath, eyebrow, stat_count, stat_label):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Skip if already updated (has section-gradient-blue)
    if 'section-gradient-blue' in content:
        print(f"  SKIP (already updated): {filepath}")
        return
    
    original = content
    content = add_reveal_import(content)
    content = transform_hero_section(content, eyebrow, stat_count, stat_label)
    
    # Simple grid/CTA wrapping 
    content = re.sub(
        r'      <section className="section-default container-modern">\n        <ProtocolGrid',
        r'      <section className="section-default container-modern">\n        <RevealSection delay={100}>\n        <ProtocolGrid',
        content, count=1
    )
    content = re.sub(
        r'        (<ProtocolGrid[^/]*/>)\n        (</section>)',
        r'        \1\n        </RevealSection>\n      \2',
        content, count=1
    )
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  UPDATED: {filepath}")
    else:
        print(f"  NO CHANGE: {filepath}")

def main():
    for slug, (eyebrow, stat_count, stat_label) in PAGE_META.items():
        filepath = os.path.join(PROTOCOLS_DIR, slug, "page.tsx")
        if os.path.exists(filepath):
            print(f"Processing {slug}...")
            process_file(filepath, eyebrow, stat_count, stat_label)
        else:
            print(f"  NOT FOUND: {filepath}")
    print("Done.")

if __name__ == "__main__":
    main()
