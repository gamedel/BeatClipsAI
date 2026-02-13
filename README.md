# BeatClipsAI MVP

MVP веб-приложение (mobile-first) + PWA для генерации видео `Image + Text -> Video` (720p, 5 сек, sound) через AtlasCloud.

## Что реализовано
- Next.js App Router + TypeScript + Tailwind.
- Prisma/Postgres модели: User, Job, CreditLedger, Template, CreditPackage, RateLimitEvent.
- TEST mode (`PUBLIC_TEST_MODE=true`) без логина с DemoUser.
- Credits (25 за генерацию / reroll), ledger, rate-limit (10 запусков/час).
- Абстракция провайдера `IVideoProvider` + адаптер `AtlasCloudProvider`.
- BullMQ worker: create job -> poll status -> upload result in S3.
- API: jobs, reroll, templates, upload signed URL, admin endpoints.
- Страницы: `/`, `/jobs`, `/jobs/[id]`, `/pricing`, скрытая `/admin` по ключу.
- PWA: manifest + service worker + installability baseline.
- Docker Compose: postgres + redis + minio.

## Быстрый старт
```bash
cp .env.example .env
npm i
docker compose up -d
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Worker отдельно:
```bash
npm run worker
```

## AtlasCloud integration
По умолчанию используется `ATLASCLOUD_BASE_URL/jobs` и `GET /jobs/:id`.
Если в аккаунте AtlasCloud другой путь/формат ответа — адаптируйте `src/lib/providers/atlascloud.ts`.

## Безопасность
- Admin page/API возвращают 404 при неверном ключе.
- Ограничения upload по MIME.
- В TEST mode включён rate-limit.
