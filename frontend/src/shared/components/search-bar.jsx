import { Input, InputGroup } from '@components/input';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';

export function SearchBar({ onChange }) {
  return (
    <InputGroup className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
      <MagnifyingGlassIcon aria-hidden="true" />
      <Input
        name="search"
        type="search"
        placeholder="Search games"
        aria-label="Search games"
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
}
