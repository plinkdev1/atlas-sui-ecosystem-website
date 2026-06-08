"use client"

import { ProtocolGrid, type Protocol } from "@/components/protocol-card"
import { Button } from "@/components/ui/button"
import { RevealSection } from "@/components/reveal-section"

const gaming: Protocol[] = [
  { name: "Abyss World", description: "Massive on-chain RPG on Sui with NFT characters, land ownership, guilds, and a player-driven economy.", tags: ["RPG", "Open World"], url: "https://abyssworld.games" },
  { name: "E4C: Final Salvation", description: "AAA blockchain action game on Sui by Ambrus Studio. PvP shooter with NFT weapons and on-chain ownership.", tags: ["AAA", "Shooter"], url: "https://e4c.world" },
  { name: "Lucky Kat", description: "Mobile-first GameFi studio on Sui with multiple casual games, NFT characters, and play-and-earn mechanics.", tags: ["Mobile", "Casual GameFi"], url: "https://luckykat.io" },
  { name: "Blockus", description: "Web3 gaming infrastructure on Sui providing SDKs, analytics, and cross-game asset interoperability.", tags: ["Gaming Infra", "SDK"], url: "https://blockus.net" },
  { name: "Worlds Beyond", description: "Sci-fi strategy game on Sui with on-chain planets, resources, and faction warfare with player governance.", tags: ["Strategy", "Sci-fi"], url: "https://worldsbeyond.game" },
  { name: "XOCIETY", description: "Third-person shooter on Sui with NFT characters, seasonal esports tournaments, and on-chain rewards.", tags: ["Shooter", "Esports"], url: "https://xociety.io" },
  { name: "Wave", description: "Music NFT game on Sui where players collect, remix, and battle with on-chain music tracks as NFTs.", tags: ["Music", "NFT Battle"], url: "https://wave.xyz" },
  { name: "Final Stardust", description: "On-chain strategy card game on Sui with collectible cards, tournaments, and seasonal battle passes.", tags: ["Card Game", "Strategy"], url: "https://finalstardust.io" },
  { name: "Cosmocadia", description: "Farm-sim adventure game on Sui with land NFTs, crafting, seasonal events, and a player marketplace.", tags: ["Farm Sim", "Land NFTs"], url: "https://cosmocadia.com" },
  { name: "Panzerdogs", description: "Tank-battle multiplayer game on Sui where NFT tanks fight for leaderboard rewards and seasonal prizes.", tags: ["PvP", "Tank Battle"], url: "https://panzerdogs.io" },
  { name: "Battlemon", description: "Turn-based monster battle game on Sui inspired by classic RPGs, with on-chain breeding and tournaments.", tags: ["Turn-based", "Monster Battle"], url: "https://battlemon.xyz" },
  { name: "Sui 8192", description: "On-chain version of the 2048 puzzle game on Sui. Mint your score as an NFT and compete on the leaderboard.", tags: ["Puzzle", "On-chain"], url: "https://ethoswallet.xyz/games/8192" },
  { name: "Haven's Compass", description: "Fantasy RPG on Sui with companion NFTs, quests, and a rich on-chain lore system for collectors.", tags: ["Fantasy RPG", "Companion NFTs"], url: "https://havenscompass.io" },
  { name: "Legend of Arcadia", description: "Strategy idle RPG on Sui with hero NFTs, guild wars, and a deep DeFi integration for hero equipment.", tags: ["Idle RPG", "Guild Wars"], url: "https://legendofarcadia.io" },
  { name: "Gameplay Galaxy", description: "Multi-game platform on Sui offering casual and competitive games with shared token economy.", tags: ["Multi-game", "Platform"], url: "https://gameplaygalaxy.com" },
  { name: "Suuuiplash", description: "Party game on Sui inspired by Jackbox. Multiplayer browser party games with on-chain NFT prizes.", tags: ["Party Game", "Multiplayer"], url: "https://suuuiplash.xyz" },
  { name: "Run Legends", description: "Mobile fitness-to-earn game on Sui rewarding real-world exercise with in-game currency and NFT rewards.", tags: ["Fitness-to-earn", "Mobile"], url: "https://runlegends.com" },
  { name: "Arcade Champion", description: "Competitive arcade game platform on Sui where classic game champions earn on-chain prizes.", tags: ["Arcade", "Competitive"], url: "https://arcadechampion.xyz" },
  { name: "M10 Sports", description: "Decentralized sports gaming platform on Sui with fantasy sports, prediction games, and NFT sports cards.", tags: ["Sports", "Fantasy"], url: "https://m10.gg" },
  { name: "VMeta3", description: "Metaverse gaming platform on Sui combining virtual real estate, social gaming, and digital commerce.", tags: ["Metaverse", "Virtual Real Estate"], url: "https://vmeta3.io" },
]

export default function GamingPage() {
  return (
    <main>
      <section className="section-gradient-blue container-modern relative overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
        <div className="space-y-6 text-center relative z-10">
          <RevealSection>
            <a href="/protocols" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Protocols</a>
            <p className="text-sm font-medium tracking-widest uppercase text-[#00d4aa]">Category</p>
            <h1 className="heading-hero">Gaming & GameFi on Sui</h1>
            <p className="text-subtitle mx-auto max-w-2xl">From AAA shooters to on-chain puzzles — explore the full Sui gaming ecosystem with 20+ titles.</p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel text-sm">
              <span className="text-gradient font-bold text-xl">20+</span>
              <span className="text-muted-foreground">Games & GameFi Protocols</span>
            </div>
          </RevealSection>
        </div>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={100}>
          <ProtocolGrid protocols={gaming} />
        </RevealSection>
      </section>
      <section className="section-default container-modern">
        <RevealSection delay={200}>
          <div className="card-modern-blue p-10 text-center space-y-4 rounded-3xl">
            <h2 className="heading-section">Building a Game on Sui?</h2>
            <p className="text-subtitle">Submit your game to be listed in the Atlas GameFi directory.</p>
            <a href="mailto:hello@atlasprotocol.space"><Button className="button-primary-modern">Submit Your Game</Button></a>
          </div>
        </RevealSection>
      </section>
    </main>
  )
}
