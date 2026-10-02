/**
 * Görsel kayıt defteri.
 *
 * PLACEHOLDER: Tüm fotoğraflar Unsplash lisansı altında (ticari kullanım serbest)
 * yalnızca önizleme amacıyla kullanılmaktadır. Yayına geçmeden önce ACG TASARIM'ın
 * kendi ürün çekimleriyle (aynı ışık, aynı zemin, 4:5 kadraj) değiştirilmelidir.
 * Bileşenler görsele yalnızca anahtar (ImageKey) ile eriştiği için değişim tek
 * dosyadan yapılır.
 */

const unsplash = {
  archCandle: '1674812709772-74b34f2ad52b',
  bubblePink: '1674812709790-d3c6fe9b8aab',
  bubbleWhite: '1750919753634-f89bdf1bae79',
  torsoCandle: '1704573982777-770d486a91c6',
  leafStones: '1705013769730-2a54649adc2b',
  concreteVessels: '1718788392540-0862a47c8c30',
  jarCandleButterfly: '1724408906332-fcca9380b68b',
  jarCandleLeaves: '1653919198320-7141a1920dcc',
  candleJarsPeach: '1643122966676-29e8597257f7',
  ovalTrays: '1747397454096-c258b72386c9',
  siliconeMoldPink: '1773609688536-404b12d4a1c7',
  donutVase: '1643569556871-91ec60671ed7',
  donutVaseFlowers: '1644682973669-c81e90336245',
  vaseCollection: '1597696929736-6d13bed8e6a8',
  decorShelf: '1640246944367-89e6a3eeab74',
  amberBottle: '1671493235081-5842463637cd',
  amberBottleAlt: '1671493234279-57ef0c8f34e6',
  diffuser: '1676852148076-7a92002419f3',
  pigmentJars: '1758426637739-fcb6eea3f4d8',
  watercolorPalette: '1646182967622-5598bc2d3a5b',
  watercolorFlowers: '1646183524322-19dc884efb25',
  waxPastilles: '1742181207763-9150475d7219',
  stonePowder: '1593095948071-474c5cc2989d',
} as const;

export type ImageKey = keyof typeof unsplash;

export interface ImageSource {
  src: string;
  srcSet: string;
}

const WIDTHS = [320, 480, 640, 860, 1080, 1400];

/**
 * @param ratio en / boy oranı (ör. 4/5). Verilirse kırpma sunucu tarafında yapılır.
 */
export function imageSource(key: ImageKey, ratio?: number, maxWidth = 1400): ImageSource {
  const id = unsplash[key];
  const url = (w: number) => {
    const h = ratio ? `&h=${Math.round(w / ratio)}` : '';
    return `https://images.unsplash.com/photo-${id}?w=${w}${h}&q=72&auto=format&fit=crop&crop=entropy`;
  };
  const widths = WIDTHS.filter((w) => w <= maxWidth);
  return {
    src: url(widths[Math.min(2, widths.length - 1)]),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
  };
}

export const BRAND = {
  lockup: './brand/acg-logo-lockup-240.webp',
  lockupPng: './brand/acg-logo-lockup-240.png',
  badge: './brand/acg-logo-badge-360.webp',
  badgePng: './brand/acg-logo-badge-360.png',
};
