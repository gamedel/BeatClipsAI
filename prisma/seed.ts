import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const demoUserId = process.env.DEMO_USER_ID ?? 'demo-user';
  await prisma.user.upsert({
    where: { id: demoUserId },
    create: { id: demoUserId, email: null, creditsBalance: 999999 },
    update: { creditsBalance: 999999 },
  });

  const packages = [
    { name: 'Starter 5', credits: 125, priceRub: 149, description: '5 видео' },
    { name: 'Lite 10', credits: 250, priceRub: 249, description: '10 видео' },
    { name: 'Pro 20', credits: 500, priceRub: 449, description: '20 видео' },
    { name: 'Studio 50', credits: 1250, priceRub: 999, description: '50 видео' },
    { name: 'Mega 100', credits: 2500, priceRub: 1890, description: '100 видео' },
  ];

  await prisma.creditPackage.deleteMany();
  await prisma.creditPackage.createMany({ data: packages });

  const templates = Array.from({ length: 10 }).map((_, i) => ({
    name: `Template ${i + 1}`,
    description: `Музыкальный шаблон #${i + 1}`,
    genre: ['phonk', 'house', 'trap', 'ambient', 'drill'][i % 5],
    previewImageUrl: `https://placehold.co/320x180?text=Template+${i + 1}`,
    audioUrl: `https://example.com/audio/template-${i + 1}.mp3`,
    promptPrefix: `Cinematic music clip, rhythmic edits, template ${i + 1}:`,
    defaultSeed: 1000 + i,
  }));

  await prisma.template.deleteMany();
  await prisma.template.createMany({ data: templates });
}

main().finally(async () => prisma.$disconnect());
