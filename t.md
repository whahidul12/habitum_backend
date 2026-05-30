backend/
│
├── src/
│ ├── config/
│ │ ├── env.ts # Zod env validation — crashes early if vars missing
│ │ └── database.ts # Mongoose connect/disconnect
│ │
│ ├── modules/ # Feature-first: each module owns its own slice
│ │ ├── auth/
│ │ │ ├── auth.controller.ts # HTTP only: parse req → call service → send res
│ │ │ ├── auth.service.ts # Business logic: register, login, token generation
│ │ │ ├── auth.routes.ts # Route definitions + middleware wiring
│ │ │ ├── auth.validation.ts # Zod schemas for request bodies
│ │ │ └── auth.types.ts # Auth-specific TS interfaces
│ │ │
│ │ ├── habits/
│ │ │ ├── habits.controller.ts
│ │ │ ├── habits.service.ts
│ │ │ ├── habits.routes.ts
│ │ │ ├── habits.validation.ts
│ │ │ └── habits.types.ts
│ │ │
│ │ ├── logs/
│ │ │ ├── logs.controller.ts
│ │ │ ├── logs.service.ts
│ │ │ ├── logs.routes.ts
│ │ │ ├── logs.validation.ts
│ │ │ └── logs.types.ts
│ │ │
│ │ └── ai/
│ │ ├── ai.controller.ts
│ │ ├── ai.service.ts # Gemini API calls live here
│ │ ├── ai.routes.ts
│ │ ├── ai.validation.ts # Validates input params (e.g. date range for insight generation)
│ │ └── ai.types.ts
│ │
│ ├── models/ # Mongoose schemas + document interfaces
│ │ ├── User.model.ts
│ │ ├── Habit.model.ts
│ │ ├── HabitLog.model.ts
│ │ └── AIInsight.model.ts
│ │
│ ├── middleware/
│ │ ├── auth.middleware.ts # JWT verify → attaches req.user
│ │ ├── error.middleware.ts # Central error handler
│ │ ├── validate.middleware.ts # Runs Zod schema on req.body
│ │ └── rateLimiter.middleware.ts # Global + auth-specific rate limits
│ │
│ ├── utils/
│ │ ├── ApiError.ts # Custom error class with statusCode
│ │ ├── asyncHandler.ts # Wraps async route fns, passes errors to next()
│ │ ├── logger.ts # Winston: pretty in dev, JSON in prod
│ │ └── dateHelper.ts # date-fns wrappers (ranges, formatting)
│ │
│ ├── types/
│ │ ├── express.d.ts # Augments Express Request with req.user
│ │ └── index.ts # Shared types: ApiResponse<T>, PaginatedResult<T>
│ │
│ ├── app.ts # Express setup (middleware, routes) — no listen()
│ └── server.ts # Calls connectDB() then app.listen()
│
├── scripts/
│ └── seed.ts # DB seed script, run with: pnpm seed
│
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json # module: NodeNext, strict: true

```

```
