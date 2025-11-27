// lib/promptLoader.ts
import fs from 'fs';
import path from 'path';

// 프롬프트 타입 정의
export type PromptType = 'risk_report' | 'portfolio_eval' | 'asset_dossier' | 'wallet_roast';

// 프롬프트 파일 매핑
const PROMPT_FILES: Record<PromptType, string> = {
  risk_report: '1_risk_report.txt',
  portfolio_eval: '2_portfolio_eval.txt',
  asset_dossier: '3_asset_dossier.txt',
  wallet_roast: '4_wallet_roast.txt',
};

// 프롬프트 캐시 (서버 재시작 전까지 유지)
const promptCache: Map<PromptType, string> = new Map();

/**
 * 프롬프트 파일을 읽어옴 (캐싱 적용)
 */
export function loadPromptTemplate(type: PromptType): string {
  // 캐시에 있으면 반환
  if (promptCache.has(type)) {
    return promptCache.get(type)!;
  }

  const fileName = PROMPT_FILES[type];
  const filePath = path.join(process.cwd(), 'lib', 'prompts', fileName);

  try {
    const template = fs.readFileSync(filePath, 'utf-8');
    promptCache.set(type, template);
    return template;
  } catch (error) {
    console.error(`프롬프트 파일 로드 실패: ${filePath}`, error);
    throw new Error(`프롬프트 템플릿을 찾을 수 없습니다: ${type}`);
  }
}

/**
 * 프롬프트 템플릿의 플레이스홀더를 실제 값으로 치환
 * @param template 프롬프트 템플릿 문자열
 * @param variables 치환할 변수들 (키: 플레이스홀더명, 값: 실제 값)
 * @returns 치환된 프롬프트
 */
export function fillPromptTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    result = result.replaceAll(placeholder, value);
  }

  return result;
}

/**
 * 프롬프트 타입과 변수를 받아 완성된 프롬프트 반환
 */
export function buildPrompt(
  type: PromptType,
  variables: Record<string, string>
): string {
  const template = loadPromptTemplate(type);
  return fillPromptTemplate(template, variables);
}

// 각 프롬프트 타입별 헬퍼 함수들

/**
 * 리스크 리포트 프롬프트 생성
 */
export function buildRiskReportPrompt(params: {
  contractInfo: object;
  rawFlags: object;
  dataSources: string[];
}): string {
  return buildPrompt('risk_report', {
    contract_info_json: JSON.stringify(params.contractInfo, null, 2),
    raw_flags_json: JSON.stringify(params.rawFlags, null, 2),
    data_sources_array: JSON.stringify(params.dataSources),
  });
}

/**
 * 포트폴리오 평가 프롬프트 생성
 */
export function buildPortfolioEvalPrompt(params: {
  holdings: object[];
  cash: number;
  recentTrades: object[];
  baseCurrency: string;
  userGoal: string;
}): string {
  return buildPrompt('portfolio_eval', {
    holdings_table_json: JSON.stringify(params.holdings, null, 2),
    cash_amount: params.cash.toString(),
    trades_json: JSON.stringify(params.recentTrades, null, 2),
    base_currency: params.baseCurrency,
    goal_text: params.userGoal,
  });
}

/**
 * 자산 도시에 프롬프트 생성
 */
export function buildAssetDossierPrompt(params: {
  asset: object;
  timeWindowDays: number;
}): string {
  return buildPrompt('asset_dossier', {
    asset_json: JSON.stringify(params.asset, null, 2),
    days: params.timeWindowDays.toString(),
  });
}

/**
 * 월렛 로스트 프롬프트 생성
 */
export function buildWalletRoastPrompt(params: {
  transactions: object[];
  period: { from: string; to: string };
  chain: string;
}): string {
  return buildPrompt('wallet_roast', {
    transactions_json: JSON.stringify(params.transactions, null, 2),
    from_to_json: JSON.stringify(params.period),
    chain: params.chain,
  });
}
