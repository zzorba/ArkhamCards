import { useCallback, useContext } from 'react';
import functions from '@react-native-firebase/functions';

import LanguageContext from '@lib/i18n/LanguageContext';

export interface ErrorResponse {
  error?: string;
}

export interface EmptyRequest {}

export function useFunction<RequestT=EmptyRequest, ResponseT=ErrorResponse>(functionName: string) {
  const { lang } = useContext(LanguageContext);
  return useCallback(async(request: RequestT): Promise<ResponseT> => {
    const response = await functions().httpsCallable(functionName)({ ...request, locale: lang });
    return response.data as ResponseT;
  }, [lang, functionName]);
}
