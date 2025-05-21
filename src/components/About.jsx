import img1 from "../../public/img1.png";
import styles from "./About.module.css";

function About() {
  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.centeredText}>
          Умный дамах <br />
        </div>
      </section>

      <section className="bg-white  py-[400px] px-4 md:px-0">
        <div className="max-w-xl mx-auto">
          <img src={img1} alt="img" className="mx-auto mb-10 rounded-lg " />

          <h2 className="text-center text-2xl font-semibold leading-snug mb-4">
            A multipurpose hall for a local school
          </h2>
          <p className="font-semibold text-center text-gray-500 text-base leading-relaxed mb-16">
            Providing shelter from the harsh Sub-Saharan heat, the hall will
            serve as a versatile community space, hosting sports activities,
            hygiene and ecological awareness workshops, as well as theatre,
            dance, music, and meditation sessions for both children and adults.
          </p>

          <div className="max-w-xl mx-auto px-4 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-6 text-center ">
              {[
                {
                  title: "Shelter",
                  desc: "A shaded space where children can safely learn, play, and gather away from extreme heat",
                },
                {
                  title: "Training",
                  desc: "Sessions on hygiene, health, and essential life skills for students and the community",
                },
                {
                  title: "Sports",
                  desc: "A shaded area for games, exercise, and sports, protected from the sun and elements.",
                },
                {
                  title: "Community",
                  desc: "A gathering space for parent-teacher meetings, village discussions, and decision-making",
                },
                {
                  title: "Arts",
                  desc: "A place for theater, workshops, and creative activities that inspire self-expression",
                },
                {
                  title: "Culture",
                  desc: "A venue for music, festivals, and performances that bring people together",
                },
                {
                  title: "Well-being",
                  desc: "A place for yoga, meditation, and movement to support physical and mental health",
                },
                {
                  title: "Events",
                  desc: "A stage for sports and talent competitions, fostering participation and growth.",
                },
              ].map((item, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm font-semibold text-gray-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-xl items-center justify-center pt-20">
            <img src={img1} alt="img" className="mx-auto mb-10 rounded-lg " />
            <h3 className=" font-semiboldtext-lg font-medium mb-1">
              Serving over 5000 people
            </h3>
            <p className=" font-semibold text-sm text-gray-500">
              The initiative will directly benefit five thousand residents
              within a 15 km radius of Bissiri, including 330 children currently
              enrolled in the local school, creating a lasting positive impact
              on education, wellness, and community development.
            </p>
          </div>
          <div className="max-w-xl items-center justify-center pt-20">
            <img src={img1} alt="img" className="mx-auto mb-10 rounded-lg " />
            <h3 className=" font-semiboldtext-lg font-medium mb-1">
              Bissiri film premiere
            </h3>
            <p className=" font-semibold text-sm text-gray-500">
              In 2025, all donors will be invited to the premiere of the Bissiri
              film — a captivating movie and series of interviews with local
              residents filmed in 2024 in the heart of the village. The premiere
              will take place in Paris before the film embarks on a global
              journey through international film festivals.
            </p>
          </div>
          <div className="max-w-xl items-center justify-center pt-20">
            <img src={img1} alt="img" className="mx-auto mb-10 rounded-lg " />
            <h3 className=" font-semiboldtext-lg font-medium mb-1">
              Your name carved in stone
            </h3>
            <p className=" font-semibold text-sm text-gray-500">
              Donors contributing 100€ or more will have their names or company
              names engraved on a dedicated stone in the Hall, commemorating
              their invaluable support.t.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
