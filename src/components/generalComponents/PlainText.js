import "./styleModules/styles.css";
export default function PlainText({ headerText,bodyText }) {
  return (
    <div className="plainTextWrapper">
      <div className="plainText" >
        <h1>{headerText}</h1>
        {bodyText}
      </div>
    </div>
  );
}
