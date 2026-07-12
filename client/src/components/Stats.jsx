function Stats() {
  return (
    <section className="py-20 bg-white">

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

        <div>
          <h2 className="text-4xl font-bold text-cyan-600">50+</h2>
          <p>Resources</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-cyan-600">500+</h2>
          <p>Students</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-cyan-600">1000+</h2>
          <p>Bookings</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-cyan-600">99%</h2>
          <p>Success Rate</p>
        </div>

      </div>

    </section>
  );
}

export default Stats;