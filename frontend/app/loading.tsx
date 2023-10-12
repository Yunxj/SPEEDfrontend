import style from "./loading.module.scss";
export default function Loading() {
  return (
    <div className={style.loadingBox}>
      <h1 className={style.textCss}>Loading...</h1>
    </div>
  );
}
