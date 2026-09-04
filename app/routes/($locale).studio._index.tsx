import rain from '~/assets/images/rain.webp';
import plane from '~/assets/images/plane.webp';
import waterLily from '~/assets/images/water_lily.webp';
import bath from '~/assets/images/bath.webp';

const PROCESS_STEPS = [
  {
    title: 'Expose',
    lead: '35mm only, handheld, in whatever light is already there. One roll per outing — thirty-six frames, no bracketing, no second attempt.',
    detail:
      'Most of the catalogue comes from stock bought long past its expiry date. It fogs, it shifts, and that drift is what gives each roll its own grey.',
    image: plane,
    alt: 'Empty aircraft cabin shot on expired 35mm film',
  },
  {
    title: 'Develop',
    lead: 'Developed by hand in small tanks, one roll at a time, pushed one or two stops to open the shadows and harden the contrast.',
    detail:
      'Negatives are dried in the room, dust and all, then read on a light table. Roughly four frames per roll make it to the darkroom.',
    image: waterLily,
    alt: 'Water lilies on a still pond, reflected trees overhead',
  },
  {
    title: 'Print',
    lead: 'Enlarged onto fibre-based baryta paper, selenium toned for depth, washed for an hour and air dried flat.',
    detail:
      'Six or seven sheets per session, signed and numbered on the verso. When the twenty-fifth print leaves the studio, the negative is filed for good.',
    image: bath,
    alt: 'Swimmers seen from above between rocks off the coast',
  },
];

export default function Studio() {
  return (
    <div className="px-16">
      <StudioHero />
      <StudioProcess />
    </div>
  );
}

function StudioHero() {
  return (
    <div className="grid grid-cols-2 items-center mt-10">
      <div className="flex flex-col gap-12">
        <h1 className="text-6xl font-bold font-clash-display uppercase max-w-xl">
          We work back from the negative.
        </h1>
        <p className="text-xl font-light font-clash-grotesk max-w-xl text-start">
          Negatif Studio is a gallery for photographs that never touched a
          sensor. Expired stock, pushed two stops, printed wet in a darkroom in
          the 10th arrondissement of Paris.
        </p>
        <p className="text-xl font-light font-clash-grotesk max-w-xl text-start">
          The studio was founded in 2023 by Clement Nicolas, who shoots one roll
          per outing and keeps the whole roll, the misses included. Prints are
          made in short sessions, six or seven sheets at a time, so no two are
          perfectly identical. Editions are capped at twenty-five; once a run
          closes the negative is filed and never printed again.
        </p>
      </div>
      <img
        src={rain}
        alt="Rain on a window, shot on 35mm film"
        decoding="async"
        className="aspect-9/16 object-cover grayscale w-full"
        style={{maxHeight: '600px', height: '100%'}}
      />
    </div>
  );
}

function StudioProcess() {
  return (
    <section className="mt-32 flex flex-col gap-32">
      <h2 className="text-5xl font-bold font-clash-display uppercase max-w-2xl">
        Three steps, none of them undoable.
      </h2>
      {PROCESS_STEPS.map((step, index) => (
        <ProcessStep key={step.title} step={step} flipped={index % 2 === 1} />
      ))}
    </section>
  );
}

function ProcessStep({
  step,
  flipped,
}: {
  step: (typeof PROCESS_STEPS)[number];
  flipped: boolean;
}) {
  return (
    <div className="grid grid-cols-2 items-center gap-20">
      {/* Text stays first in the DOM; `order` only flips the visual side. */}
      <div className={`flex flex-col gap-6 ${flipped ? 'order-2' : ''}`}>
        <h3 className="text-3xl font-bold font-clash-display uppercase">
          {step.title}
        </h3>
        <p className="text-xl font-light font-clash-grotesk max-w-md">
          {step.lead}
        </p>
        <p className="text-lg font-light font-clash-grotesk max-w-md text-text">
          {step.detail}
        </p>
      </div>
      <img
        src={step.image}
        alt={step.alt}
        loading="lazy"
        decoding="async"
        className={`aspect-3/2 w-full object-cover ${flipped ? 'order-1' : ''}`}
      />
    </div>
  );
}
