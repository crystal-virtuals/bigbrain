import { AuthLayout } from '@components/auth-layout';
import { Button } from '@components/button';
import { ErrorMessage, Field, Label } from '@components/fieldset';
import { Heading } from '@components/heading';
import { Input } from '@components/input';
import { Strong, Text } from '@components/text';
import { api } from '@utils/api.js';
import { storeAuthToken } from '@utils/auth';
import { getInputErrors, getFormErrors } from '@utils/validation.js';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(new Map());
  const [person, setPerson] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    // set value
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
    // update errors
    const newErrors = getInputErrors(name, value, person, errors);
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = getFormErrors(person);
    setErrors(newErrors);
    if (newErrors.size > 0) return;

    api
      .post('/admin/auth/register', {
        email: person.email,
        password: person.password,
        name: person.name,
      })
      .then((response) => onSuccess(response))
      .catch((error) => onError(error));
  };

  const onSuccess = (response) => {
    console.log('Successfully registered:', response);
    storeAuthToken(response.token);
    navigate('/dashboard');
  };

  const onError = (error) => {
    console.error('Signup failed:', error);
    // Handle error
    const newErrors = new Map();
    newErrors.set('email', error);
    setErrors(newErrors);
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="grid w-full max-w-sm grid-cols-1 gap-8"
        noValidate
      >
        <Heading>Create your account</Heading>
        <Field>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={person.email}
            invalid={errors.has('email')}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.has('email') && (
            <ErrorMessage>{errors.get('email')}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Name</Label>
          <Input
            name="name"
            value={person.name}
            invalid={errors.has('name')}
            onChange={handleChange}
            autoComplete="username"
          />
          {errors.has('name') && (
            <ErrorMessage>{errors.get('name')}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={person.password}
            invalid={errors.has('password')}
            onChange={handleChange}
          />
          {errors.has('password') && (
            <ErrorMessage>{errors.get('password')}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={person.confirmPassword}
            invalid={errors.has('confirmPassword')}
            onChange={handleChange}
          />
          {errors.has('confirmPassword') && (
            <ErrorMessage>{errors.get('confirmPassword')}</ErrorMessage>
          )}
        </Field>

        <Button type="submit" className="w-full">
          Create account
        </Button>

        <Text>
          Already have an account?{' '}
          <Link to="/login" className="link">
            <Strong>Sign in here</Strong>
          </Link>
        </Text>
      </form>
    </AuthLayout>
  );
}
