import { HeadingBorder } from '@components/heading';
import { splitNumber } from '@utils/helpers';

export function SessionId({ sessionId }) {
  return (
    <HeadingBorder>
      <div className="flex flex-row items-center justify-center flex-1 gap-3">
        {splitNumber(sessionId).map((number, index) => (
          <div key={index}>{number}</div>
        ))}
      </div>
    </HeadingBorder>
  );
}
