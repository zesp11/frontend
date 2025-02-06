import "./styles.css";
export default function PlainText({ text }) {
    return (
        <div className="plainTextWrapper">
            <p className="plainText">
              {text}
            </p>
        </div>
      );
    }