const basePath=process.env.NEXT_PUBLIC_BASE_PATH??"";
export default function NotFound(){return <main className="not-found shell"><span>404 · DATA NOT FOUND</span><h1>찾는 페이지가 없습니다.</h1><p>주소가 변경되었거나 아직 검증된 데이터 페이지가 아닐 수 있습니다.</p><nav><a href={`${basePath}/`}>홈으로</a><a href={`${basePath}/#data-catalog`}>카테고리 탐색</a><a href={`${basePath}/methodology/`}>데이터 방법론</a></nav></main>}
