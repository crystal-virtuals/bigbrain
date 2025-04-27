import { Field } from '@components/fieldset';
import { ControlledInput, LabelTab } from '@components/form';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

function TrueFalseButton({ isTrue, setTrue }) {
  const base = 'shadow-md text-white flex rounded-lg items-center justify-center p-2 ml-2 touch-manipulation cursor-pointer pointer-events-auto w-[100px] gap-1';
  const styles = {
    true: 'bg-emerald-400 shadow-emerald-800',
    false: 'bg-rose-500 shadow-rose-900',
  }

  return (
    <button
      type="button"
      className={clsx(base, isTrue ? styles.true : styles.false)}
      onClick={() => setTrue((prev) => !prev)}
    >
      <span span className="text-sm font-bold text-white">
        {isTrue ? 'True' : 'False'}
      </span>

      <CheckIcon
        aria-hidden="true"
        className="size-5 stroke-2 stroke-white"
        style={{ display: isTrue ? 'block' : 'none' }}
      />

      <XMarkIcon
        aria-hidden="true"
        className="size-5 stroke-2 stroke-white"
        style={{ display: isTrue ? 'none' : 'block' }}
      />
    </button>
  );
}

// One answer, either true or false
export default function Judgement({ answers, setAnswers }) {

  const updateAnswer = (changes) => {
    setAnswers([{ ...answers[0], ...changes }]);
  };

  return (
    <>
      <Field className="col-span-full">
        <LabelTab label="True or False answer" type='dark' >
          <div className="flex flex-row items-center gap-1">

            <ControlledInput
              type="text"
              value={answers[0].name}
              onChange={(e) => updateAnswer({ name: e.target.value })}
              required
              correct={answers[0].correct}
            />

            <TrueFalseButton
              isTrue={answers[0].correct}
              setTrue={(bool) => updateAnswer({ correct: bool })}
            />

          </div>
        </LabelTab>
      </Field>
    </>
  );
}
