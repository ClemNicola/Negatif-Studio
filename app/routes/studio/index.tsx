import {
  bath,
  plane,
  rain,
  waterLily,
  type LocalImage,
} from '~/assets/images/generated';
import type {Route} from './+types/index';

const IMAGE_SIZES = '(min-width: 48em) 50vw, 100vw';

const PROCESS_STEPS: {
  title: string;
  lead: string;
  detail: string;
  image: LocalImage;
  alt: string;
}[] = [
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

export const meta: Route.MetaFunction = () => {
  const title = 'Negatif Studio | We work back from the negative';
  const description =
    'Negatif Studio is a gallery for photographs that never touched a sensor. Expired stock, pushed two stops, printed wet in a darkroom in the 10th arrondissement of Paris.';
  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:site_name', content: 'Negatif Studio'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:image', content: rain.src},
  ];
};

export function links() {
  return [
    {
      rel: 'preload',
      as: 'image',
      imageSrcSet: rain.srcSet,
      imageSizes: IMAGE_SIZES,
      fetchPriority: 'high',
    },
  ];
}

export default function Studio() {
  return (
    <div className="mb-10 md:px-16">
      <StudioHero />
      <StudioProcess />
    </div>
  );
}

function StudioHero() {
  return (
    <div className="mt-6 grid gap-8 md:mt-10 md:grid-cols-2 md:items-center md:gap-0">
      <div className="flex flex-col gap-6 md:gap-12">
        <h1 className="text-4xl md:text-6xl font-bold font-clash-display uppercase max-w-xl">
          We work back from the negative.
        </h1>
        <p className="text-base md:text-xl font-light font-clash-grotesk max-w-xl text-start">
          Negatif Studio is a gallery for photographs that never touched a
          sensor. Expired stock, pushed two stops, printed wet in a darkroom in
          the 10th arrondissement of Paris.
        </p>
        <p className="text-base md:text-xl font-light font-clash-grotesk max-w-xl text-start">
          The studio was founded in 2023 by Clement Nicolas, who shoots one roll
          per outing and keeps the whole roll, the misses included. Prints are
          made in short sessions, six or seven sheets at a time, so no two are
          perfectly identical. Editions are capped at twenty-five; once a run
          closes the negative is filed and never printed again.
        </p>
      </div>
      <img
        src={rain.src}
        srcSet={rain.srcSet}
        sizes={IMAGE_SIZES}
        width={rain.width}
        height={rain.height}
        alt="Rain on a window, shot on 35mm film"
        fetchPriority="high"
        decoding="async"
        className="aspect-4/5 w-full object-cover grayscale md:aspect-9/16 md:h-full md:max-h-[600px]"
      />
    </div>
  );
}

function StudioProcess() {
  return (
    <section className="mt-16 flex flex-col gap-16 md:mt-32 md:gap-32">
      <h2 className="text-2xl md:text-5xl font-bold font-clash-display uppercase max-w-2xl">
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
    <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-20">
      {/* Text stays first in the DOM; `order` only flips the visual side, and
          only from md up — on mobile every step reads text then image. */}
      <div className={`flex flex-col gap-6 ${flipped ? 'md:order-2' : ''}`}>
        <h3 className="text-2xl md:text-3xl font-bold font-clash-display uppercase">
          {step.title}
        </h3>
        <p className="text-base md:text-xl font-light font-clash-grotesk max-w-md">
          {step.lead}
        </p>
        <p className="text-sm md:text-lg font-light font-clash-grotesk max-w-md text-text">
          {step.detail}
        </p>
      </div>
      <img
        src={step.image.src}
        srcSet={step.image.srcSet}
        sizes={IMAGE_SIZES}
        width={step.image.width}
        height={step.image.height}
        alt={step.alt}
        loading="lazy"
        decoding="async"
        className={`aspect-3/2 w-full object-cover ${flipped ? 'md:order-1' : ''}`}
      />
    </div>
  );
}
