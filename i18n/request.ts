import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { locales, type Locale } from './routing';

export default getRequestConfig(async () => {
  // 쿠키에서 언어 설정 가져오기
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;

  // 쿠키에 저장된 언어가 유효한지 확인
  let locale: Locale = 'ko';

  if (localeCookie && locales.includes(localeCookie as Locale)) {
    locale = localeCookie as Locale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

