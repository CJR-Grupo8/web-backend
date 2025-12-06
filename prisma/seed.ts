import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  allProductSummaries,
  allProductDetails,
} from '../../../Front/web-frontend/src/data/product';
import { STORES } from '../../../Front/web-frontend/src/data/stores';

const prisma = new PrismaClient();

const productDetailsMap = new Map(
  allProductDetails.map((detail) => [detail.id, detail]),
);

function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parsePrice(value: string): number {
  if (!value) return 0;
  const cleaned = value
    .replace(/[^0-9,.-]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.');

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatStoreName(slug: string): string {
  if (!slug) return 'Loja Parceira';

  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((piece) => {
      if (piece === '&') {
        return '&';
      }

      return piece.charAt(0).toUpperCase() + piece.slice(1);
    })
    .join(' ')
    .replace(/\s&\s/g, ' & ');
}

function buildImageUrl(slug?: string): string {
  if (!slug) {
    return 'https://placehold.co/600x600/111/fff?text=Produto';
  }

  if (slug.startsWith('http')) {
    return slug;
  }

  return `http://localhost:3000/images/produtos/${slug}.svg`;
}

async function ensureSellerUser() {
  const email = 'seed.seller@plataforma.dev';
  const passwordHash = await bcrypt.hash('seed1234', 10);

  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      fullName: 'Seed Seller',
      username: 'seed-seller',
      email,
      password: passwordHash,
      avatar: null,
    },
  });
}

async function seedStaticStores(ownerId: number) {
  const slugToId = new Map<string, number>();

  for (const store of STORES) {
    const slug = toSlug(store.slug ?? store.name);

    const lojaData = {
      nome: store.name,
      descricao:
        store.owner?.length
          ? `${store.name} — administrada por ${store.owner}`
          : `${store.name} — loja em destaque na plataforma`,
      categoria: store.categoryLabel ?? store.category,
      donoId: ownerId,
    };

    const existing = await prisma.loja.findFirst({ where: { nome: store.name } });
    const loja = existing
      ? await prisma.loja.update({ where: { id: existing.id }, data: lojaData })
      : await prisma.loja.create({ data: lojaData });

    slugToId.set(slug, loja.id);
  }

  return slugToId;
}

async function seedProductStores(
  ownerId: number,
  slugToId: Map<string, number>,
) {
  const sealToStoreId = new Map<string, number>();
  const seen = new Set<string>();

  for (const summary of allProductSummaries) {
    if (seen.has(summary.seal)) continue;
    seen.add(summary.seal);

    const sealSlug = toSlug(summary.seal);
    const storeIdFromSlug = slugToId.get(sealSlug);

    if (storeIdFromSlug) {
      sealToStoreId.set(summary.seal, storeIdFromSlug);
      continue;
    }

    const nome = formatStoreName(summary.seal);

    const existing = await prisma.loja.findFirst({ where: { nome } });
    const loja = existing
      ? await prisma.loja.update({
          where: { id: existing.id },
          data: {
            nome,
            descricao: existing.descricao ?? `Loja oficial ${nome}`,
            categoria: summary.category,
            donoId: ownerId,
          },
        })
      : await prisma.loja.create({
          data: {
            nome,
            descricao: `Loja oficial ${nome}`,
            categoria: summary.category,
            donoId: ownerId,
          },
        });

    slugToId.set(sealSlug, loja.id);
    sealToStoreId.set(summary.seal, loja.id);
  }

  return sealToStoreId;
}

async function seedProducts(storeMap: Map<string, number>) {
  for (const summary of allProductSummaries) {
    const detail = productDetailsMap.get(summary.id);
    const lojaId = storeMap.get(summary.seal);

    if (!lojaId) {
      console.warn(`Loja não encontrada para o selo ${summary.seal}`);
      continue;
    }

    const imageSlug = detail?.images?.[0] || summary.image;
    const preco = detail?.price ?? parsePrice(summary.price);
    const quantidade =
      detail?.stockCount ?? (summary.availability === 'DISPONÍVEL' ? 25 : 0);

    const produtoData = {
      nome: detail?.name ?? summary.name,
      preco,
      descricao:
        detail?.description ??
        'Produto em fase de cadastro. Descrição em breve.',
      categoria: summary.category,
      imageUrl: buildImageUrl(imageSlug),
      quantidade,
      lojaId,
    };

    await prisma.produto.upsert({
      where: { id: Number(summary.id) },
      update: produtoData,
      create: {
        id: Number(summary.id),
        ...produtoData,
      },
    });
  }
}

async function bumpSequence() {
  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('"Produto"', 'id'),
      GREATEST((SELECT MAX(id) FROM "Produto"), 0)
    );
  `);

  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('"Loja"', 'id'),
      GREATEST((SELECT MAX(id) FROM "Loja"), 0)
    );
  `);
}

async function main() {
  const seller = await ensureSellerUser();
  const slugToStoreId = await seedStaticStores(seller.id);
  const sealToStoreId = await seedProductStores(seller.id, slugToStoreId);
  await seedProducts(sealToStoreId);
  await bumpSequence();

  console.log('✅ Lojas e produtos fake sincronizados no banco.');
}

main()
  .catch((error) => {
    console.error('❌ Falha ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
