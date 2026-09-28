export default function Stars({ rating = 5, reviews }) {
  return (
    <span className="stars">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
      {reviews != null ? <em>({reviews})</em> : null}
    </span>
  );
}
