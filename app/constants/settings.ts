// 투자 성향 타입
export interface InvestmentStyle {
  label: string;
  description: string;
  emoji: string;
  color: string;
  thumbColor: string;
}

// Roast 강도 타입
export interface RoastLevel {
  label: string;
  description: string;
  emoji: string;
  thumbColor: string;
}

// 투자 성향 옵션
export const INVESTMENT_STYLES: InvestmentStyle[] = [
  {
    label: "안정형",
    description: "원금 보존을 최우선으로 하며, 낮은 수익률도 감수합니다.",
    emoji: "🛡️",
    color: "text-success",
    thumbColor: "#22c55e",
  },
  {
    label: "안정추구형",
    description: "안정적인 수익을 추구하며, 소폭의 손실은 감수할 수 있습니다.",
    emoji: "🌿",
    color: "text-success",
    thumbColor: "#84cc16",
  },
  {
    label: "위험중립형",
    description: "적정한 위험과 수익의 균형을 추구합니다.",
    emoji: "⚖️",
    color: "text-warning",
    thumbColor: "#f59e0b",
  },
  {
    label: "적극투자형",
    description: "높은 수익을 위해 상당한 위험을 감수할 수 있습니다.",
    emoji: "🚀",
    color: "text-orange-500",
    thumbColor: "#f97316",
  },
  {
    label: "공격투자형",
    description: "최대 수익을 위해 높은 변동성과 손실 위험을 감수합니다.",
    emoji: "🔥",
    color: "text-error",
    thumbColor: "#ef4444",
  },
];

// Roast 강도 옵션 (0: 가장 약함 → 4: 가장 강함)
export const ROAST_LEVELS: RoastLevel[] = [
  {
    label: "Kind",
    description: "가장 부드러운 피드백. 격려와 긍정적인 면을 강조합니다.",
    emoji: "😊",
    thumbColor: "#38bdf8",
  },
  {
    label: "Mild",
    description: "약한 피드백. 친절하지만 개선점도 부드럽게 제안합니다.",
    emoji: "🙂",
    thumbColor: "#22d3ee",
  },
  {
    label: "Medium",
    description: "중간 강도. 균형 잡힌 현실적인 피드백을 제공합니다.",
    emoji: "😐",
    thumbColor: "#f59e0b",
  },
  {
    label: "Spicy",
    description: "강한 피드백. 직설적이고 날카로운 지적을 합니다.",
    emoji: "😤",
    thumbColor: "#f97316",
  },
  {
    label: "Hot",
    description: "가장 강한 피드백. 거침없는 로스트 스타일로 현실을 직시하게 합니다.",
    emoji: "🔥",
    thumbColor: "#ef4444",
  },
];

// 기본 설정값
export const DEFAULT_SETTINGS = {
  investmentStyle: 2,
  livingExpenseRatio: 60,
  investmentRatio: 30,
  roastLevel: 2,
};

