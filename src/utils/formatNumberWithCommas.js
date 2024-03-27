// 숫자를 우측부터 3자리마다 콤마를 찍어 문자열로 반환하는 함수
export default function formatNumberWithCommas(number) {
  if (!number) {
    return "0";
  }
  return number.toLocaleString();
}