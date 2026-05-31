import { Schema, model } from "mongoose";
import {
  IAIInsight,
  AIInsightModel,
  AIInsightDocument,
  CreateAIInsightDto,
  IAIInsightMethods,
  EInsightType,
} from "./aiInsight.types.js";

const AIInsightSchema = new Schema<IAIInsight, AIInsightModel, IAIInsightMethods>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(EInsightType), // Dynamically pulls values from your TS enum
      required: [true, "Insight type is required"],
    },
    content: {
      type: String,
      required: [true, "Insight content is required"],
      trim: true,
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const AIInsight = model<IAIInsight, AIInsightModel>("AIInsight", AIInsightSchema);
export default AIInsight;
