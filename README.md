# Aqsa Zone Frontend

Next.js frontend for Aqsa Zone. The UI, pages, components, styling and public/admin screens live in this repository.

## Local development

```bash
npm install
npm run dev
```

Set:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

The backend runs separately on port `4000`.

## Production

Deploy this repository to Vercel.

Set:

```env
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-DOMAIN
```

Do not put PostgreSQL credentials or Firebase Admin credentials in this repository.
