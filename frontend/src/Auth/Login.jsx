import { AuthLayout } from '@components/auth-layout'
import { Button } from '@components/button'
import { ErrorMessage, Field, Label } from '@components/fieldset'
import { Heading } from '@components/heading'
import { Input } from '@components/input'
import { Strong, Text } from '@components/text'
import { api } from '@utils/api.js';
import { storeAuthToken } from '@utils/auth';
import { validateInput, validateForm } from '@utils/validation.js';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(new Map());
  const [person, setPerson] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerson({
      ...person,
      [name]: value,
    });
    const newErrors = validateInput(name, value, errors);
    setErrors(newErrors)
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm(person);
    setErrors(newErrors);
    if (newErrors.size > 0) return;

    api.post('/admin/auth/login', person)
      .then((response => onSuccess(response)))
      .catch((error) => onError(error));
  };

  const onSuccess = (response) => {
    console.log('Successfully logged in', response);
    storeAuthToken(response.token);
    navigate('/dashboard');
  }

  const onError = (error) => {
    console.error('Invalid credentials', error);

    // Handle error
    const newErrors = new Map();
    newErrors.set('email', error);
    setErrors(newErrors);
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="grid w-full max-w-sm grid-cols-1 gap-8"
        noValidate
      >
        <Heading>Sign in to your account</Heading>
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
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={person.password}
            invalid={errors.has('password')}
            onChange={handleChange}
            autoComplete="password"
          />
          {errors.has('password') && (
            <ErrorMessage>{errors.get('password')}</ErrorMessage>
          )}
        </Field>

        <Button type="submit" className="w-full">
          Login
        </Button>

        <Text>
          Don’t have an account?{' '}
          <Link to="/register" className="link">
            <Strong>Sign up now</Strong>
          </Link>
        </Text>
      </form>
    </AuthLayout>
  );
}
