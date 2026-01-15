import { Shield, Heart, Users, MapPin, Leaf, Globe, Compass, Camera, Mountain, Waves, ChevronRight, Quote } from 'lucide-react';

function AboutPage() {
  const destinations = [
    {
      name: 'Kenya',
      description: 'Golden savannas and timeless wildlife rhythms',
      image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.webp?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Tanzania',
      description: 'Serengeti plains and Ngorongoro grandeur',
      image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.webp?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'South Africa',
      description: 'Where safari meets sophisticated refinement',
      image: 'https://images.pexels.com/photos/2832034/pexels-photo-2832034.webp?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Zanzibar',
      description: 'Spice-scented shores and Swahili charm',
      image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.webp?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Uganda',
      description: 'Misty forests and mountain gorilla encounters',
      image: 'https://images.pexels.com/photos/6032845/pexels-photo-6032845.webp?auto=compress&cs=tinysrgb&w=800'
    },
    {
      name: 'Rwanda',
      description: 'Transformative wildlife connections',
      image: 'https://images.pexels.com/photos/5604916/pexels-photo-5604916.webp?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const wildlifeGallery = [
    'https://images.pexels.com/photos/247376/pexels-photo-247376.webp?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2317904/pexels-photo-2317904.webp?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1190298/pexels-photo-1190298.webp?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/39310/giraffe-animal-funny-facial-expression-39310.webp?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2422915/pexels-photo-2422915.webp?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1086455/pexels-photo-1086455.webp?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/802112/pexels-photo-802112.webp?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1595503/pexels-photo-1595503.webp?auto=compress&cs=tinysrgb&w=800'
  ];

  const values = [
    {
      icon: Heart,
      title: 'Authentic Connection',
      description: 'We design journeys that create genuine bonds with Africa\'s land, wildlife, and people.'
    },
    {
      icon: Shield,
      title: 'Uncompromising Quality',
      description: 'Every detail is curated with precision, from handpicked lodges to expert local guides.'
    },
    {
      icon: Leaf,
      title: 'Responsible Travel',
      description: 'Conservation and community support are woven into every experience we create.'
    },
    {
      icon: Globe,
      title: 'Local Expertise',
      description: 'Born and rooted in Africa, we know these lands intimately and share them with pride.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
        }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950/95" />
          <img
            src="https://images.pexels.com/photos/1054655/pexels-photo-1054655.webp?auto=compress&cs=tinysrgb&w=1920"
            alt="African wilderness at sunset"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32 text-center">
          <div className="inline-block mb-8">
            <div className="flex items-center gap-3 px-6 py-3 bg-amber-600/20 border border-amber-500/30 rounded-full backdrop-blur-sm">
              <Compass className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-semibold tracking-wide uppercase text-sm">About Our Journey</span>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Where Africa's Soul
            </span>
            <br />
            <span className="text-white">Meets Your Story</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
            Born from a deep reverence for Africa's untamed beauty, Karla Tours and Travel curates transformative journeys across the continent's most spectacular landscapes.
          </p>
          <div className="mt-12 flex items-center justify-center gap-2 text-slate-400">
            <Mountain className="w-5 h-5" />
            <span className="text-sm tracking-widest uppercase">Scroll to explore our story</span>
          </div>
        </div>
      </div>

      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="relative">
              <div className="sticky top-24">
                <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                  <img
                    src="https://images.pexels.com/photos/2709388/pexels-photo-2709388.webp?auto=compress&cs=tinysrgb&w=1200"
                    alt="Founder contemplating African landscape"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <div className="text-amber-400 text-sm font-semibold tracking-wider uppercase mb-2">Our Founder</div>
                    <div className="text-white text-2xl font-bold">A Calling, Not Just a Business</div>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="relative h-[180px] rounded-xl overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/2422915/pexels-photo-2422915.webp?auto=compress&cs=tinysrgb&w=600"
                      alt="Safari guide"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="relative h-[180px] rounded-xl overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/3573382/pexels-photo-3573382.webp?auto=compress&cs=tinysrgb&w=600"
                      alt="African sunset"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <Quote className="w-12 h-12 text-amber-500 flex-shrink-0 mt-2" />
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    A Note From Our Founder
                  </h2>
                </div>
              </div>

              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  There was a moment, somewhere between the vast African sky and the quiet rhythm of the land, when travel stopped being a business idea and became a <span className="text-amber-400 font-semibold">calling</span>. Watching the sun rise over untamed landscapes, I realized that Africa does not simply welcome you — <span className="text-white font-semibold">it awakens you</span>. That moment shaped the heart of Karla Tours and Travel.
                </p>

                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  What began as a passion for exploration grew into a commitment to curate journeys that go beyond destinations. At Karla Tours and Travel, we don't sell trips — <span className="text-amber-400 font-semibold">we design experiences that linger long after the journey ends</span>.
                </p>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 my-8 backdrop-blur">
                  <p className="text-slate-200 text-lg leading-relaxed italic">
                    "Across East, Central, and Southern Africa, every place tells a different story."
                  </p>
                </div>

                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  In <span className="text-amber-400 font-semibold">Kenya</span>, golden savannas stretch endlessly as wildlife moves to an ancient rhythm unchanged by time. Private game drives unfold at dawn, where silence is broken only by the call of the wild and luxury is defined by space, privacy, and authenticity.
                </p>

                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  <span className="text-amber-400 font-semibold">Tanzania</span> reveals grandeur on a monumental scale. From the sweeping plains of the Serengeti to the breathtaking Ngorongoro Crater, nature performs at its most dramatic. Here, evenings are spent beneath star-filled skies, dining in secluded camps where elegance meets raw wilderness.
                </p>

                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  <span className="text-amber-400 font-semibold">South Africa</span> adds a sophisticated contrast — where world-class safaris meet cosmopolitan refinement. From private reserves bordering Kruger National Park to the vibrant energy of Cape Town, guests enjoy exceptional game viewing by day and fine dining, acclaimed wines, and coastal beauty by night. It is a destination where African adventure blends effortlessly with modern luxury.
                </p>

                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  <span className="text-amber-400 font-semibold">Zanzibar</span> offers a softer escape — a sensory journey where white-sand beaches meet centuries of culture. The air is rich with spice and history, and days unfold at an unhurried pace, blending oceanfront luxury with Swahili charm.
                </p>

                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  In <span className="text-amber-400 font-semibold">Uganda and Rwanda</span>, the experience becomes deeply personal. Trekking through misty forests to encounter mountain gorillas is both humbling and transformative. These moments remind us that true luxury lies not in excess, but in connection — to nature, to people, and to purpose.
                </p>

                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  What truly defines Karla Tours and Travel is our dedication to thoughtful, personalized journeys. We work closely with trusted local experts, conservation partners, and handpicked lodges to ensure every detail is seamless, meaningful, and responsibly crafted.
                </p>

                <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-8 my-8">
                  <p className="text-white text-xl leading-relaxed font-medium">
                    Whether you're seeking adventure, tranquility, cultural depth, or refined indulgence, we invite you to experience Africa as we know it — authentic, elegant, and unforgettable.
                  </p>
                </div>

                <div className="border-l-4 border-amber-500 pl-6 my-8">
                  <p className="text-slate-200 text-xl leading-relaxed font-light">
                    Welcome to Africa, curated with heart.<br />
                    <span className="text-amber-400 font-semibold">Welcome to Karla Tours and Travel.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3 px-6 py-3 bg-amber-600/20 border border-amber-500/30 rounded-full backdrop-blur-sm">
                <Camera className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 font-semibold tracking-wide uppercase text-sm">The Meaning Behind Our Name</span>
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Karla: A Spectrum of
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Africa's Beauty
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-6">
              <p className="text-xl text-slate-300 leading-relaxed">
                The name <span className="text-amber-400 font-bold text-2xl">Karla</span> is inspired by <span className="text-white font-semibold">color</span> — a reflection of Africa's extraordinary beauty, depth, and vibrancy. It represents the countless shades that define this continent:
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-white font-bold text-lg mb-2">Golden Savannas</div>
                  <div className="text-amber-100 text-sm">Endless plains under African sun</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-white font-bold text-lg mb-2">Emerald Forests</div>
                  <div className="text-emerald-100 text-sm">Lush canopies and hidden trails</div>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-white font-bold text-lg mb-2">Sapphire Oceans</div>
                  <div className="text-blue-100 text-sm">Pristine coastal paradise</div>
                </div>
                <div className="bg-gradient-to-br from-orange-700 to-red-700 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-white font-bold text-lg mb-2">Rust-Red Earth</div>
                  <div className="text-orange-100 text-sm">Ancient soil rich with life</div>
                </div>
              </div>

              <p className="text-lg text-slate-300 leading-relaxed pt-4">
                For centuries, Africa has been misunderstood, reduced to a single narrative, or unfairly diminished. At Karla Tours and Travel, we stand at the forefront of changing that perception.
              </p>
            </div>

            <div className="relative">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/2422915/pexels-photo-2422915.webp?auto=compress&cs=tinysrgb&w=1200"
                  alt="African cultural richness"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 rounded-3xl p-12 mb-16">
            <div className="max-w-4xl mx-auto space-y-8">
              <p className="text-2xl text-white leading-relaxed font-light text-center">
                We believe Africa is not one color, one story, or one experience — it is a <span className="text-amber-400 font-bold">breathtaking spectrum of life, heritage, and wonder</span>.
              </p>

              <div className="grid md:grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Diverse Cultures</h3>
                  <p className="text-slate-400 text-sm">Timeless traditions and warm hospitality</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Mountain className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Epic Landscapes</h3>
                  <p className="text-slate-400 text-sm">From mountains to coastlines</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Powerful Stories</h3>
                  <p className="text-slate-400 text-sm">Resilience, creativity, and strength</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-500/30 rounded-3xl p-12">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Karla is our statement that <span className="text-amber-400">black is beautiful</span>
              </h3>
              <p className="text-xl text-slate-300 leading-relaxed">
                Not as an absence of color, but as its <span className="text-white font-semibold">foundation</span>. It is strength, elegance, resilience, and creativity. It is the soil that gives life, the night sky that holds the stars, and the people whose stories shape the soul of the continent.
              </p>
              <div className="pt-6">
                <div className="inline-block px-8 py-4 bg-amber-600 text-white font-bold rounded-lg text-lg">
                  Every journey transforms perspective
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              The Wild Awaits
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Witness Africa's magnificent wildlife in their natural kingdom
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {wildlifeGallery.map((image, index) => (
              <div
                key={index}
                className="relative h-[280px] rounded-xl overflow-hidden group cursor-pointer"
                style={{
                  gridRow: index === 0 || index === 5 ? 'span 2' : 'span 1'
                }}
              >
                <img
                  src={image}
                  alt={`African wildlife ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
              <Compass className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Expert Guides</h3>
              <p className="text-slate-400 leading-relaxed">
                Our local guides have spent lifetimes studying wildlife behavior and know exactly where to find Africa's most spectacular moments.
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
              <Camera className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Prime Locations</h3>
              <p className="text-slate-400 leading-relaxed">
                Access to exclusive conservation areas and prime viewing spots during peak wildlife activity hours.
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8">
              <Shield className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Ethical Practices</h3>
              <p className="text-slate-400 leading-relaxed">
                All safaris follow strict ethical guidelines that prioritize animal welfare and habitat preservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our Destinations
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              From thundering migrations to intimate encounters, each destination offers its own unforgettable story
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-500"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Destination</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{destination.name}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{destination.description}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all duration-300">
                    Explore <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              What Defines Us
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Our values are the compass that guides every journey we create
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-10 hover:border-amber-500/50 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                    <p className="text-slate-400 text-lg leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950" />
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.pexels.com/photos/631317/pexels-photo-631317.webp?auto=compress&cs=tinysrgb&w=1920"
              alt="Conservation"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Travel With Purpose
            </h2>
            <p className="text-xl text-emerald-200 leading-relaxed">
              Every journey with Karla creates tangible impact. Your travels directly support conservation, empower local communities, and preserve Africa's heritage for generations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Wildlife Protection</h3>
              <p className="text-emerald-100 leading-relaxed mb-6">
                Direct funding to anti-poaching units and habitat restoration projects in the regions we visit.
              </p>
              <div className="text-3xl font-bold text-emerald-400">$85K+</div>
              <div className="text-emerald-200 text-sm mt-2">Contributed to conservation</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Community Support</h3>
              <p className="text-emerald-100 leading-relaxed mb-6">
                Employment for local guides, staff, and artisans, supporting entire families and villages.
              </p>
              <div className="text-3xl font-bold text-blue-400">147</div>
              <div className="text-emerald-200 text-sm mt-2">Local jobs created</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Cultural Preservation</h3>
              <p className="text-emerald-100 leading-relaxed mb-6">
                Investment in schools and cultural centers that preserve traditions and educate youth.
              </p>
              <div className="text-3xl font-bold text-amber-400">12K+</div>
              <div className="text-emerald-200 text-sm mt-2">Travelers welcomed</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32 bg-gradient-to-br from-amber-700 via-orange-700 to-amber-800">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/1670732/pexels-photo-1670732.webp?auto=compress&cs=tinysrgb&w=1920"
            alt="Safari sunset"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Your Africa Story
            <br />
            Begins Here
          </h2>
          <p className="text-2xl text-amber-50 mb-12 leading-relaxed font-light">
            Whether you dream of witnessing the Great Migration, tracking gorillas through misty forests, or unwinding on Zanzibar's pristine shores — we'll craft a journey that speaks to your soul.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group px-10 py-5 bg-white text-amber-900 rounded-xl font-bold text-lg hover:bg-amber-50 transition-all duration-300 shadow-2xl flex items-center gap-3">
              Start Planning Your Journey
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="px-10 py-5 bg-transparent border-3 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-amber-900 transition-all duration-300 shadow-2xl">
              Speak With Our Team
            </button>
          </div>
          <p className="text-amber-100 text-sm mt-10 font-light">
            Personalized itineraries crafted with care • Seamless from start to finish • Memories that last forever
          </p>
        </div>
      </section>

      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Karla Tours & Travel
            </div>
            <p className="text-slate-400 mb-8">
              Curating Africa's most transformative journeys
            </p>
            <div className="flex justify-center gap-8 text-slate-500 text-sm">
              <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Contact Us</a>
            </div>
            <p className="text-slate-600 text-xs mt-8">
              © 2024 Karla Tours and Travel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;