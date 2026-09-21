import {Form, useActionData, useNavigation} from 'react-router';
import type {Route} from './+types/index';

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const STUDIO = {
  email: 'hello@negatifstudio.fr',
  phone: '+33 1 84 25 07 12',
};

type FieldName = 'name' | 'email' | 'message';
type ContactErrors = Partial<Record<FieldName, string>>;
type ContactValues = Record<FieldName, string>;

export const meta: Route.MetaFunction = () => {
  const title = 'Negatif Studio | Write to the studio';
  const description =
    'Questions on an edition, framing or shipping outside the EU — write to the studio, one of us answers within two working days.';
  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:site_name', content: 'Negatif Studio'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
  ];
};

export async function action({request}: Route.ActionArgs) {
  const form = await request.formData();
  const values: ContactValues = {
    name: String(form.get('name') ?? '').trim(),
    email: String(form.get('email') ?? '').trim(),
    message: String(form.get('message') ?? '').trim(),
  };

  const errors: ContactErrors = {};
  if (!values.name) {
    errors.name = 'Tell us who is writing.';
  }
  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'We need a reachable email to answer.';
  }
  if (values.message.length < 10) {
    errors.message = 'A line or two about the print, please.';
  }

  if (Object.keys(errors).length > 0) {
    return {ok: false as const, errors, values};
  }

  return {ok: true as const, errors: {} as ContactErrors, values};
}

export default function Contact() {
  const result = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSending = navigation.formMethod === 'POST';

  return (
    <div className="my-6 md:my-10 md:px-16">
      <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        <ContactIntro />
        {result?.ok ? (
          <ContactSent name={result.values.name} />
        ) : (
          <ContactForm
            errors={result?.errors}
            values={result?.values}
            isSending={isSending}
          />
        )}
      </div>
    </div>
  );
}

function ContactIntro() {
  return (
    <div className="flex flex-col gap-8 md:gap-16">
      <h1 className="text-4xl md:text-6xl font-bold font-clash-display uppercase max-w-xl">
        Write to the studio.
      </h1>
      <p className="text-base md:text-xl font-light font-clash-grotesk max-w-lg">
        Questions on an edition, framing, shipping outside the EU, or a print
        you saw somewhere and cannot find here — one of us answers within two
        working days.
      </p>
      <section className="flex flex-col gap-1 p-0">
        <h2 className="contact-label">Direct</h2>
        <a
          className="link-underline w-fit text-base md:text-lg font-light"
          href={`mailto:${STUDIO.email}`}
        >
          {STUDIO.email}
        </a>
        <a
          className="link-underline w-fit text-base md:text-lg font-light"
          href={`tel:${STUDIO.phone.replace(/\s/g, '')}`}
        >
          {STUDIO.phone}
        </a>
      </section>
    </div>
  );
}

function ContactForm({
  errors,
  values,
  isSending,
}: {
  errors?: ContactErrors;
  values?: ContactValues;
  isSending: boolean;
}) {
  return (
    <Form method="post" noValidate className="flex flex-col gap-10">
      <Field
        name="name"
        label="Full name"
        placeholder="Full name"
        autoComplete="name"
        defaultValue={values?.name}
        error={errors?.name}
      />
      <Field
        name="email"
        type="email"
        label="Email"
        placeholder="you@domain.com"
        autoComplete="email"
        defaultValue={values?.email}
        error={errors?.email}
      />
      <Field
        name="message"
        label="Message"
        placeholder="Which print, which format, and where it is going."
        multiline
        defaultValue={values?.message}
        error={errors?.message}
      />
      <button
        className="button-slide cursor-pointer w-full py-5 text-sm uppercase tracking-[0.2em] font-clash-grotesk"
        type="submit"
        disabled={isSending}
      >
        {isSending ? 'Sending' : 'Send message'}
      </button>
    </Form>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = 'text',
  autoComplete,
  defaultValue,
  error,
  multiline = false,
}: {
  name: FieldName;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  multiline?: boolean;
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    placeholder,
    defaultValue,
    className: 'contact-input font-clash-grotesk',
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? errorId : undefined,
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="contact-label" htmlFor={id}>
        {label}
      </label>
      <div className="contact-field" data-invalid={error ? 'true' : 'false'}>
        {multiline ? (
          <textarea {...shared} rows={6} />
        ) : (
          <input {...shared} type={type} autoComplete={autoComplete} />
        )}
      </div>
      {error ? (
        <p className="text-sm font-light text-text/70" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ContactSent({name}: {name: string}) {
  return (
    <div className="flex flex-col gap-6 self-start border-t border-text pt-8">
      <p className="contact-label">Message received</p>
      <p className="text-base md:text-xl font-light font-clash-grotesk max-w-lg">
        Thank you{name ? `, ${name.split(' ')[0]}` : ''}. One of us reads every
        message and answers within two working days, from {STUDIO.email}.
      </p>
    </div>
  );
}
