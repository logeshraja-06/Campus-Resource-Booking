import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {

  return (

    <>

      <Navbar />

      <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-700 to-cyan-500 text-white">

        <h1 className="text-6xl font-bold">

          Campus Resource Booking

        </h1>

        <p className="mt-6 text-xl">

          Book Labs, Seminar Halls and Campus Resources Easily.

        </p>

        <button className="mt-8 bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200">

          Get Started

        </button>

      </section>

      <Footer />

    </>

  );

}

export default Home;