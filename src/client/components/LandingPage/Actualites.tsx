import styles from "../../styles/LandingPage/Actualites.module.scss";
import Link from "next/link";
import cardData from "../../../FakeDatas/LandingPage.cards.json";
import LandingCard from "./LandingCard";
import Masonry from "react-masonry-css";

const Actualites = () => {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 2,
    500: 1,
  };

  const cards = cardData.map((res, i) => (
    <LandingCard
      key={i}
      course={res.course}
      date={res.date}
      img={`${i}`}
      matiere={res.matiere}
      time={res.time}
      title={res.title}
    />
  ));

  return (
    <div className={styles.actualites_container}>
      <h2>Nos p’tites actus.</h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.myMasonryGrid}
        columnClassName={styles.myMasonryGridColumn}
      >
        {cards}
      </Masonry>
      <button className={styles.btnConnexion}>
        <Link href={`/user/login`}>
          <a>Voir tous les cours</a>
        </Link>
      </button>
    </div>
  );
};
export default Actualites;
