type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // 필요한 HTTP 메서드를 추가할 수 있습니다.
    body?: any;
    headers?: Record<string, string>;
    query?: Record<string, string | number>;
};

const customFetch = async <T>(endpoint: string, options: FetchOptions = {}): Promise<{
    data: any;
    message: string;
    success: boolean;
}> => {
    const { method = 'GET', body, headers = {}, query = {} } = options;

    // 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // query 객체가 있으면 URL에 쿼리 문자열을 추가
    const queryString = new URLSearchParams(query).toString();
    const fullUrl = queryString
        ? `${process.env.NEXT_PUBLIC_API_URL}${endpoint}?${queryString}`
        : `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    const fetchOptions: RequestInit = {
        method, // 기본값은 'GET'
        headers: {
            ...(body instanceof FormData ? {  } : { 'Content-Type': 'application/json' }),
            ...headers, // 다른 헤더가 있으면 추가
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
        credentials: "include"
    };

    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
        if (response.status === 403) {
            alert('권한이 없습니다.');

        } else {
            throw new Error('네트워크 응답이 올바르지 않습니다');
        }
    }

    // 응답 본문이 비어있지 않으면 JSON 파싱
    const textResponse = await response.text(); // 응답을 텍스트로 읽음
    if (!textResponse) {
        return {}; // 빈 응답일 경우 빈 객체 반환
    }

    try {
        const parsedResponse: T = JSON.parse(textResponse);

        // 파싱된 결과가 객체인 경우만 반환
        if (parsedResponse && typeof parsedResponse === 'object' && !Array.isArray(parsedResponse)) {
            return parsedResponse;
        }
    } catch (e) {
        // JSON 파싱 오류가 나면 그대로 텍스트 반환
    }

    return textResponse;
};

export default customFetch;
