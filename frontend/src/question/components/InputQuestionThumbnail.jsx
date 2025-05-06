import { ThumbnailInput } from '@components/form';
import clsx from 'clsx';

function InputQuestionThumbnail({ question, setQuestion }) {
  const styles = [
    'flex flex-col lg:justify-start gap-4 p-4 sm:rounded-xl',
    'bg-zinc-100 dark:bg-zinc-800',
    'shadow-xs ring-1 ring-zinc-900/5',
  ];

  const setThumbnail = (dataUrl) => {
    setQuestion((prev) => ({ ...prev, thumbnail: dataUrl }));
  }

  return (
    <div className={clsx(styles)}>
      <ThumbnailInput
        name="thumbnail"
        value={question.thumbnail}
        onChange={(dataUrl) => setThumbnail(dataUrl)}
      />
    </div>
  );
}

export default InputQuestionThumbnail;