# ACG TASARIM — Web Sitesi V1 Önizleme

**Canlı önizleme:** https://ogulaydincozuk.github.io/acg-tasarim/

Müşteriye gösterilecek frontend önizlemesi: ana sayfa, ürün listeleme, ürün detay, arama, sepet/favori akışı ve akademi rehberi. Backend, ödeme, üyelik ve gerçek stok V2/V3'e bırakıldı.

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tip kontrolü + üretim çıktısı (dist/)
npm run preview    # dist/ çıktısını yerelde sunar
```

`main` dalına yapılan her push, `.github/workflows/deploy.yml` ile otomatik olarak GitHub Pages'e yayınlanır.

`dist/` klasörü ayrıca herhangi bir statik sunucuya (Netlify, Vercel, cPanel vb.) olduğu gibi yüklenebilir. Yönlendirme `HashRouter` ile yapıldığı için sunucu ayarı gerekmez. Dosyayı çift tıklayarak (`file://`) açmak tarayıcı kısıtı nedeniyle çalışmaz.

## Sayfalar

| Yol | İçerik |
|---|---|
| `#/` | Ana sayfa: hero, kategori keşfi, öne çıkanlar, "Bu kalıpla ne yapabilirsin?", başlangıç setleri, yeni gelenler, seçili fırsatlar, hesaplayıcılar, akademi, ACG ile üretenler |
| `#/kategori/kaliplar` | Listeleme: sol filtre (kategori, kullanım alanı, tema, boyut, fiyat, stok, yeni, çok satan), sıralama, aktif filtre çipleri, mobilde alttan açılan filtre paneli |
| `#/kategori/{hammaddeler, setler, mum, sabun, epoksi, kokulu-tas, boyama, dekorasyon, yeni-gelenler, kampanyalar}` | Aynı listeleme şablonu |
| `#/arama?q=mum` | Arama sonuçları (+ header'daki arama paneli: son/popüler aramalar, kategori ve ürün önerileri) |
| `#/urun/{slug}` | Ürün detay: galeri, satın alma alanı, sekmeler (mobilde akordeon), "Bu ürünle ne yapabilirsin?", tamamlayıcı ve benzer ürünler, mobilde yapışkan sepet barı |
| `#/rehber/{slug}` | Akademi rehberi + rehberde kullanılan ürünler |

## Yapı

```
src/
  styles/tokens.css   Renk paletleri (design token) ve tipografi/boşluk ölçeği
  styles/base.css     Reset, buton sistemi, ortak yardımcılar
  data/               Mock veri: ürünler, kategoriler/navigasyon, içerik, görseller
  lib/                Arama (Türkçe karakter duyarsız), filtre/sıralama, biçimlendirme
  context/            Sepet, favoriler, son aramalar, global katmanlar
  components/         Layout (header, mega menü, footer), ürün kartı/grid, arama, sepet, UI
  sections/           Ana sayfa bölümleri
  pages/              Sayfa bileşenleri
public/brand/         Logodan türetilmiş web boyutları (orijinal dosya değiştirilmedi)
```

## Renk paletleri

Aktif palet **Palet 1 — Soft Premium**. Palet 2 (Ivory & Blush) ve Palet 3 (ACG Modern) `src/styles/tokens.css` içinde hazır ama pasif. Denemek için `index.html` içindeki `<html data-theme="soft-premium">` değerini `ivory-blush` veya `acg-modern` yapmak yeterli.

Taupe (`#8C8179`) küçük metinde WCAG AA kontrastını karşılamadığı için küçük ikincil metinlerde bir ton koyusu kullanılır (`--color-text-secondary`); taupe'un kendisi büyük metin ve süslemelerde kalır.

## Yayın öncesi değiştirilecek placeholder'lar

Kodda `PLACEHOLDER` olarak işaretlendi:

- **Görseller:** `src/data/images.ts` — Unsplash stok fotoğrafları (önizleme amaçlı). ACG'nin kendi çekimleri (aynı ışık, aynı zemin, 4:5 kadraj) gelince yalnızca bu dosya güncellenir.
- **Mağaza bilgileri:** `src/data/content.ts` → `STORE` (kargo eşiği, süreler, iletişim, sosyal medya hesapları — adres girilene kadar ikonlar "yakında" bilgisi gösterir).
- **Ürün verisi:** `src/data/products.ts` — fiyat, stok, puan ve yorum sayıları örnektir.
- **ACG ile Üretenler:** stok görsel; kullanıcı adı/yorum uydurulmadı.
- **Yorumlar:** puan özeti + "örnek yorum alanı"; gerçek yorum sistemi V2.
- **Footer:** ödeme logoları ve güven mesajları.

## V2'ye bırakılanlar

Ödeme, üyelik/giriş, sipariş, kargo entegrasyonu, ERP/stok API, kampanya motoru, admin paneli, gerçek yorum sistemi, Instagram API. Hesaplayıcılar basit yaklaşık formüllerle çalışan bir arayüz önizlemesidir.

Üretimde, 4.000+ ürün ve SEO için sunucu tarafı render (ör. Next.js) ve bir arama servisi (Meilisearch, Algolia vb.) önerilir; bileşenler ve veri modeli buna göre ayrıldı (filtre durumu URL'de, arama `lib/search.ts` arayüzünün arkasında).
