import img1 from "../../public/img1.png";
import styles from "./About.module.css";

function About() {
  const features = [
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
  ];

  return (
    <>
      {/* Başlık kısmı */}
      <section className={styles.wrapper}>
        <div className={styles.centeredText}>Умный дамах</div>
      </section>

      {/* İçerik bölümü */}
      <section className="bg-white pt-96 pb-10 px-4 md:px-0">
        <div className="max-w-xl mx-auto">
          {/* Giriş kısmı */}
          <img src={img1} alt="img" className="mx-auto mb-10 rounded-lg" />

          <h2 className="text-center text-2xl font-semibold leading-snug mb-4">
            A multipurpose hall for a local school
          </h2>
          <p className="font-semibold text-center text-gray-500 text-base leading-relaxed mb-16">
            Providing shelter from the harsh Sub-Saharan heat, the hall will
            serve as a versatile community space, hosting sports activities,
            hygiene and ecological awareness workshops, as well as theatre,
            dance, music, and meditation sessions for both children and adults.
          </p>

          {/* Özellikler grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-6 text-center">
            {features.map((item, index) => (
              <div key={index}>
                <h3 className="font-semibold text-2xl mb-1">{item.title}</h3>
                <p className="text-sm font-semibold text-gray-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Ek Bilgi Kartları */}
          <div className="pt-20 space-y-20">
            <div className="text-center">
              <img src={img1} alt="img" className="mx-auto mb-10 rounded-lg" />
              <h3 className="font-semibold text-2xl mb-1">
                Serving over 5000 people
              </h3>
              <p className="font-semibold text-sm text-gray-500 max-w-md mx-auto">
                The initiative will directly benefit five thousand residents
                within a 15 km radius of Bissiri, including 330 children
                currently enrolled in the local school, creating a lasting
                positive impact on education, wellness, and community
                development.
              </p>
            </div>

            <div className="text-center">
              <img src={img1} alt="img" className="mx-auto mb-10 rounded-lg" />
              <h3 className="font-semibold text-2xl mb-1">
                Bissiri film premiere
              </h3>
              <p className="font-semibold text-sm text-gray-500 max-w-md mx-auto">
                In 2025, all donors will be invited to the premiere of the
                Bissiri film — a captivating movie and series of interviews with
                local residents filmed in 2024 in the heart of the village. The
                premiere will take place in Paris before the film embarks on a
                global journey through international film festivals.
              </p>
            </div>

            <div className="text-center">
              <img src={img1} alt="img" className="mx-auto mb-10 rounded-lg" />
              <h3 className="font-semibold text-2xl mb-1">
                Your name carved in stone
              </h3>
              <p className="font-semibold text-sm text-gray-500 max-w-md mx-auto">
                Donors contributing 100€ or more will have their names or
                company names engraved on a dedicated stone in the Hall,
                commemorating their invaluable support.
              </p>
            </div>
          </div>

         
          <div className="w-full max-w-xl mx-auto mt-28 border-t pt-16">
            <div className="flex justify-between mb-10">
              <div>
                <h2 className="text-black font-semibold mb-4">Project by</h2>
                <div className="font-semibold  grid grid-cols-2 gap-y-2 gap-x-6 text-[#2E2E2E] text-sm">
                  {[
                    "Amurt",
                    "Sobra Architectes",
                    "L’Aile Universelle",
                    "Bouchaud Architectes",
                    "Egg Studio",
                    "Seconde Œuvre",
                    "Tistas",
                  ].map((org, i) => (
                    <span key={i}>
                      {org}{" "}
                      <i className="fa-solid fa-chevron-right text-xs ml-1"></i>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-black font-semibold mb-4">Documents</h2>
                <ul className="font-semibold  text-sm space-y-2">
                  <li className=" flex items-center text-[#B0B0B0] hover:text-[#3d7aff] transition-colors duration-300 ">
                    <i className=" "></i>{" "}
                    Project presentation
                  </li>
                  {["Tehnical information", "Budget breakdown", "Taxes"].map(
                    (doc, i) => (
                      <li
                        className="font-semibold  flex items-center text-[#B0B0B0] hover:text-[#3d7aff] transition-colors duration-300"
                        key={i}
                      >
                        <i className="flex items-center text-[#3d7aff] font-semibold  "></i>{" "}
                        {doc}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <i className="fa-solid fa-seedling text-4xl text-[#3d7aff] mb-6"></i>
              <h1 className="text-center text-[22px] font-medium leading-tight text-black mb-2">
                Help us build the Hall of
                <br />
                Awakening
              </h1>
              <p className="font-semibold  text-sm text-[#4F4F4F] mb-6">
                Contact us
              </p>

              <div className="w-full bg-[#F3F3F3] rounded-full flex items-center justify-between px-4 py-3 mb-5">
                <input
                  type="text"
                  placeholder="+7 212 22-35-22"
                  className="bg-transparent outline-none text-sm w-full"
                />
                <div className="flex items-center space-x-2 ml-2 text-[#1E1E1E]">
                  <i className="fa-brands fa-cc-visa text-lg"></i>
                  <i className="fa-brands fa-cc-mastercard text-lg"></i>
                  <i className="fa-brands fa-apple-pay text-lg"></i>
                  <i className="fa-brands fa-google-pay text-lg"></i>
                </div>
              </div>

              <div className=" font-semibold  flex gap-4 mb-4">
                {["Reliable", "Fast", "Durable", "Affordable"].map((amount) => (
                  <button
                    key={amount}
                    className={`px-6 py-2 rounded-full shadow text-sm border ${
                      amount === 500
                        ? "text-[#3d7aff] border-[#3d7aff] bg-white"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>

              <p className="font-semibold  text-[#3d7aff] text-sm text-center max-w-xs mb-10">
                Donors contributing over €100 will have their names
                <br />
                engraved on a dedicated stone
              </p>

              <p className="font-semibold  text-center text-black text-sm mb-10">
                A heartfelt thank you from
                <br />
                the people of Bissiri!
              </p>

              <button className="flex items-center gap-2 px-6 py-2 text-[#B0B0B0] border border-[#E0E0E0] rounded-full text-sm">
                Get in touch <i className="fa-regular fa-pen-line"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
