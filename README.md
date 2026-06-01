```
backend/
│
├── src/
│ ├── config/
│ │ ├── env.ts
│ │ └── database.ts
│ │
│ ├── modules/
│ │ ├── auth/
│ │ │ ├── auth.controller.ts
│ │ │ ├── auth.service.ts
│ │ │ ├── auth.routes.ts
│ │ │ ├── auth.validation.ts
│ │ │ └── auth.types.ts
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
│ │ ├── ai.service.ts
│ │ ├── ai.routes.ts
│ │ ├── ai.validation.ts
│ │ └── ai.types.ts
│ │
│ ├── models/
│ │ ├── User.model.ts
│ │ ├── Habit.model.ts
│ │ ├── HabitLog.model.ts
│ │ └── AIInsight.model.ts
│ │
│ ├── middleware/
│ │ ├── auth.middleware.ts
│ │ ├── error.middleware.ts
│ │ ├── validate.middleware.ts
│ │ └── rateLimiter.middleware.ts
│ │
│ ├── utils/
│ │ ├── ApiError.ts
│ │ ├── asyncHandler.ts
│ │ ├── logger.ts
│ │ └── dateHelper.ts
│ │
│ ├── types/
│ │ ├── express.d.ts
│ │ └── index.ts
│ │
│ ├── app.ts
│ └── server.ts
│
├── scripts/
│ └── seed.ts
│
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
```
