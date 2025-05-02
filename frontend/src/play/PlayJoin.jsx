import { Button } from '@components/button';
import { ErrorMessage, Field, Fieldset, Label } from '@components/fieldset';
import { Input, InputError } from '@components/input';
import { PageContent, PageLayout } from '@components/page-layout';
import { isEmptyString } from '@utils/validation';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '@components/dialog';
import { playerAPI } from '@services/api';
import { useToast } from '@hooks/toast';
import * as Headless from '@headlessui/react';
import { FormAlert } from '@components/form';

export default function PlayJoin() {
  const [formdata, setFormdata] = useState({ sessionId: '', name: '' });
  const [errors, setErrors] = useState(new Map());
  const toastify = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = new Map();
    const { sessionId, name } = formdata;
    if (isEmptyString(name)) {
      newErrors.set('name', 'Name cannot be empty');
    }
    if (isEmptyString(sessionId)) {
      newErrors.set('sessionId', 'Session ID cannot be empty');
    }
    if (!/^\d+$/.test(sessionId)) {
      newErrors.set('sessionId', 'Session ID must be a number');
    }
    setErrors(newErrors);
    return newErrors.size === 0;
  };

  const updateError = (name, message) => {
    setErrors((prev) => {
      const newErrors = new Map(prev);
      if (message) {
        newErrors.set(name, message);
      } else {
        newErrors.delete(name);
      }
      return newErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const { sessionId, name } = formdata;
    try {
      const playerId = await playerAPI.joinSession(sessionId, name);
      toastify.success({ message: `Joining session ${sessionId} as ${name}` });
      navigate(`/play/${sessionId}/${playerId}`);
    } catch (error) {
      toastify.error({ message: 'Invalid input', description: error.message });
      updateError('sessionId', error.message);
    }
  };

  return (
    <PageLayout className="flex flex-col items-center justify-center h-screen">
      <PageContent
        title="Join a Game"
        description="Enter the session ID to join a game."
      >
        <div className="px-6 py-4 rounded-xl bg-base-100/80 border-2 border-beige-300 w-full max-w-xl drop-shadow-xl">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {/* Form errors */}
            {errors.size > 0 && (
              <FormAlert errors={errors}>
                <ul role="list" className="list-disc">
                  {Array.from(errors).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </FormAlert>
            )}
            <Fieldset className="w-full">
              <div
                data-slot="control"
                className="grid grid-cols-1 items-center gap-x-4 gap-y-6 sm:grid-cols-3"
              >
                <Headless.Field className="grid grid-cols-subgrid sm:col-span-3 items-center">
                  <Label htmlFor="playerName" className="col-span-1">
                    Name
                  </Label>
                  <InputError
                    id="playerName"
                    name="name"
                    placeholder="Enter your name"
                    type="text"
                    value={formdata.name}
                    onChange={handleChange}
                    className="mt-3 sm:col-span-2 sm:mt-0"
                    invalid={errors.has('name')}
                    pink
                  />
                </Headless.Field>
                <Headless.Field className="grid grid-cols-subgrid sm:col-span-3 items-center">
                  <Label htmlFor="sessionId" className="col-span-1">
                    Session ID
                  </Label>
                  <InputError
                    id="sessionId"
                    name="sessionId"
                    type="text"
                    value={formdata.sessionId}
                    onChange={handleChange}
                    placeholder="Session ID"
                    className="mt-3 sm:col-span-2 sm:mt-0"
                    invalid={errors.has('sessionId')}
                    pink
                  />
                </Headless.Field>
              </div>
            </Fieldset>
            <Button type="submit" className="flex-1 w-full">
              Enter
            </Button>
          </form>
        </div>
      </PageContent>
    </PageLayout>
  );
}
