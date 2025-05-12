import { Button } from '@components/button';
import { ErrorMessage, Field, Label } from '@components/fieldset';
import { Heading } from '@components/heading';
import { InputError } from '@components/input';
import { Link } from '@components/link';
import { Strong, Text } from '@components/text';
import { getFormErrors, getInputErrors } from '@utils/validation.js';
import { useState } from 'react';
import { Branding } from '@components/branding';

const emptyFormData = (isLogin) => {
  return {
    email: '',
    password: '',
    ...(isLogin ? {} : { name: '', confirmPassword: '' }),
  };
}

export default function AuthForm({ isLogin, onSubmit }) {
  const [errors, setErrors] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(emptyFormData(isLogin));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const newErrors = getInputErrors(name, value, formData, errors);
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate the form
    const newErrors = getFormErrors(formData);
    setErrors(newErrors);
    if (newErrors.size > 0) {
      return;
    }

    // send the form data to the server
    setLoading(true);
    onSubmit(formData)
      .then(() => {
        setFormData(emptyFormData(isLogin));
        setErrors(new Map());
      })
      .catch((error) => {
        const newErrors = new Map();
        newErrors.set('email', error.message);
        setErrors(newErrors);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-sm grid-cols-1 gap-8"
      noValidate
    >
      <Branding size="md" className="-ml-3" />
      <Heading>
        {isLogin ? 'Sign in to your account' : 'Create your account'}
      </Heading>

      {/* Email Field (always shown) */}
      <Field>
        <Label htmlFor="email">Email</Label>
        <InputError
          id="email"
          type="email"
          name="email"
          value={formData.email}
          invalid={errors.has('email')}
          onChange={handleChange}
          autoComplete="email"
        />
        {errors.has('email') && (
          <ErrorMessage>{errors.get('email')}</ErrorMessage>
        )}
      </Field>

      {/* Name Field (only for register) */}
      {!isLogin && (
        <Field>
          <Label htmlFor='name'>Name</Label>
          <InputError
            id="name"
            name="name"
            value={formData.name}
            invalid={errors.has('name')}
            onChange={handleChange}
            autoComplete="username"
          />
          {errors.has('name') && (
            <ErrorMessage>{errors.get('name')}</ErrorMessage>
          )}
        </Field>
      )}

      {/* Password Field (always shown) */}
      <Field>
        <Label htmlFor='password'>Password</Label>
        <InputError
          id="password"
          type="password"
          name="password"
          value={formData.password}
          invalid={errors.has('password')}
          onChange={handleChange}
        />
        {errors.has('password') && (
          <ErrorMessage>{errors.get('password')}</ErrorMessage>
        )}
      </Field>

      {/* Confirm Password (only for register) */}
      {!isLogin && (
        <Field>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <InputError
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            invalid={errors.has('confirmPassword')}
            onChange={handleChange}
            disabled={isLogin}
          />
          {errors.has('confirmPassword') && (
            <ErrorMessage>{errors.get('confirmPassword')}</ErrorMessage>
          )}
        </Field>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full items-center"
        disabled={loading}
      >
        {loading && <span className="loading loading-spinner"></span> }
        <span>{isLogin ? 'Login' : 'Create account'}</span>
      </Button>

      {/* Toggle between login and register */}
      <Text>
        {isLogin ? "Don't" : 'Already'} have an account?{' '}
        <Link to={isLogin ? '/register' : '/login'}>
          <Strong>Sign {isLogin ? 'up' : 'in'}</Strong>
        </Link>
      </Text>
    </form>
  );
}
