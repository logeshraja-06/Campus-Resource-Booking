import { FaCalendarCheck, FaUniversity, FaUsers } from "react-icons/fa";

function Features() {
  return (
    <section className="bg-slate-100 py-20">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose Our Platform?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">

            <FaCalendarCheck className="text-5xl text-cyan-600 mx-auto mb-4" />

            <h3 className="font-bold text-xl">
              Easy Booking
            </h3>

            <p className="mt-4">
              Reserve resources within seconds.
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">

            <FaUniversity className="text-5xl text-cyan-600 mx-auto mb-4" />

            <h3 className="font-bold text-xl">
              Smart Management
            </h3>

            <p className="mt-4">
              Admin manages every resource efficiently.
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">

            <FaUsers className="text-5xl text-cyan-600 mx-auto mb-4" />

            <h3 className="font-bold text-xl">
              Role Based Access
            </h3>

            <p className="mt-4">
              Students and Admin have separate permissions.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Features;