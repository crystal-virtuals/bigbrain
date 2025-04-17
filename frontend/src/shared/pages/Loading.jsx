import { Heading } from '@components/heading';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Heading>
        Loading <span className="loading loading-dots loading-sm"></span>
      </Heading>
    </div>
  );
}
