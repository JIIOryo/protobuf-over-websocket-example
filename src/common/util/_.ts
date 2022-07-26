/**
 * each
 *
 * - objectのvalueとkeyを順番に処理する
 * - `_.each`のラッパー
 *   - `_.each`のobjectを入れた時の型がついているもの
 *   - `_.each`はいろいろ入れられそうだけど、`_.each`のラッパーとして使うわけではないので、現在はobjectのみ対応
 *
 * @template V - objectのvalueの型
 * @template K - objectのkeyの型
 * @param {{[_K in K]?: V}} obj object
 * @param {(v: V, k: K) => void} callback - コールバック
 * @return {{[_K in K]?: V}}
 */
export function each<V, K extends string>(obj: { [_K in K]?: V }, callback: (v: V, k: K) => void): { [_K in K]?: V } {
  // @ts-expect-error TS-2769
  return lodash.each(obj, callback)
}
