"use client"
import PartnersCarousel from "./partners-carousel"

// Partner images
const partnerImages = [
  "/partners/1.Solana.webp",
  "/partners/2.peaq.webp",
  "/partners/3.aptos.webp",
  "/partners/4.eclipse.webp",
  "/partners/5.Fracton.webp",
  "/partners/6.soonami.webp",
  "/partners/7.akindo.webp",
  "/partners/8.filecoin.webp",
  "/partners/9.unilend.webp",
  "/partners/10.spheron.webp",
  "/partners/11.u2u.webp",
  "/partners/12.denet.webp",
  "/partners/13.numa.webp",
  "/partners/14.radar-drop.webp",
  "/partners/15.wootzapp.webp",
  "/partners/16.alibaba.webp",
  "/partners/17.deanslist.webp",
  "/partners/18.superteam.webp",
  "/partners/19.flow.webp",
  "/partners/20.islanddao.webp",
  "/partners/21.lucknowdao.webp",
  "/partners/22.aydo.webp",
]

export default function PartnersMarquee() {
  return <PartnersCarousel images={partnerImages} />
}
