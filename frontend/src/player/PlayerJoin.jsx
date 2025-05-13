import { Button } from '@components/button';
import { FormErrors } from '@components/form';
import { PageContent, PageLayout } from '@components/page-layout';
import { Field, FieldGroup, Form, Input, Label } from '@components/play/form';
import { useToast } from '@hooks/toast';
import { usePlayerApi } from '@hooks/api';
import { isEmptyString } from '@utils/validation';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSession } from '@hooks/session';

export default function PlayerJoin() {
  const params = useParams();
  const [formdata, setFormdata] = useState({
    sessionId: params.sessionId || '',
    name: '',
  });
  const [errors, setErrors] = useState(new Map());
  const { updatePlayer, clear } = useSession();
  const toastify = useToast();
  const navigate = useNavigate();
  const playerAPI = usePlayerApi();

  const validate = () => {
    const newErrors = new Map();
    // validate the name
    if (isEmptyString(formdata.name)) {
      newErrors.set('name', 'Name cannot be empty');
    }
    // only validate sessionId if it's not provided in the URL
    if (!params.sessionId) {
      if (isEmptyString(formdata.sessionId)) {
        newErrors.set('sessionId', 'Session ID cannot be empty');
      }
      if (!/^\d+$/.test(formdata.sessionId)) {
        newErrors.set('sessionId', 'Session ID must be a number');
      }
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

      // Save player info
      clear();
      updatePlayer({
        id: playerId,
        name: name,
        sessionId: sessionId,
      });

      toastify.success({ message: `Joining session ${sessionId} as ${name}` });
      navigate(`/play/${sessionId}/${playerId}`);
    } catch (error) {
      toastify.error({ message: 'Failed to join session' });
      if (error.message.toLowerCase().includes('session')) {
        // handle session errors
        updateError('sessionId', error.message);
        navigate('/play');
      } else {
        // handle other errors
        updateError('name', error.message);
      }
    }
  };

  return (
    <PageLayout className="flex flex-col items-center justify-center h-full">
      <PageContent
        title="Join a Game"
        description={
          params.sessionId
            ? 'Enter your name to join the game'
            : 'Enter your name and session ID to join the game'
        }
      >
        <Form onSubmit={handleSubmit}>
          <FormErrors errors={errors} />

          <FieldGroup>
            <Field>
              <Label htmlFor="playerName">Name</Label>
              <Input
                id="playerName"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formdata.name}
                onChange={handleChange}
                invalid={errors.has('name')}
              />
            </Field>

            {!params.sessionId && (
              <Field>
                <Label htmlFor="sessionId">Session ID</Label>
                <Input
                  id="sessionId"
                  name="sessionId"
                  type="text"
                  value={formdata.sessionId}
                  onChange={handleChange}
                  placeholder="Session ID"
                  invalid={errors.has('sessionId')}
                />
              </Field>
            )}
          </FieldGroup>

          <Button type="submit" className="flex-1 w-full" color="white">
            Enter
          </Button>
        </Form>
      </PageContent>
    </PageLayout>
  );
}
