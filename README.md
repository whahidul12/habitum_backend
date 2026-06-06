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
│ │ ├── habitLog/
│ │ │ ├── habitLog.controller.ts
│ │ │ ├── habitLog.service.ts
│ │ │ ├── habitLog.routes.ts
│ │ │ ├── habitLog.validation.ts
│ │ │ └── habitLog.types.ts
│ │ │
│ │ └── aiInsight/
│ │ ├── aiInsight.controller.ts
│ │ ├── aiInsight.service.ts
│ │ ├── aiInsight.routes.ts
│ │ ├── aiInsight.validation.ts
│ │ └── aiInsight.types.ts
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

add custom build
