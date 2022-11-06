import React from 'react'

type RatingCompProps = {
  rating: number;
  numReviews?: number;
};

const RatingComp:React.FC<RatingCompProps> = ({rating}) => {
  let star = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      star.push(<i key={Math.random()} className="fas fa-star text-warning" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      star.push(<i key={Math.random()} className="fas fa-star-half-alt text-warning" />);
    } else {
      star.push(<i key={Math.random()} className="far fa-star text-warning" />);
    }
  }


  return (
    <div>{star}</div>
  )
}

export default RatingComp