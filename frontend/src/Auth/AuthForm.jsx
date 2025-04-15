import { Button } from '@components/button';
import { ErrorMessage, Field, Label } from '@components/fieldset';
import { Heading } from '@components/heading';
import { Input } from '@components/input';
import { Strong, Text } from '@components/text';
import { getFormErrors, getInputErrors } from '@utils/validation.js';
import { useState } from 'react';
import { Alert } from '@components/toast';
import { Link } from '@components/link';

export default function AuthForm({ isLogin, onSubmit }) {
  const [errors, setErrors] = useState(new Map());
  const [showError, setShowError] = useState(false);
  const [status, setStatus] = useState('typing');
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const newErrors = getInputErrors(name, value, formData, errors);
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');

    // validate the form
    const newErrors = getFormErrors(formData);
    setErrors(newErrors);
    if (newErrors.size > 0) {
      setStatus('typing');
      return;
    }

    onSubmit(formData)
      .then(() => {
        // clear the form
        setFormData({});
        setErrors(new Map());
        setShowError(false);
      })
      .catch((error) => {
        // show the error
        const newErrors = new Map();
        newErrors.set('email', error);
        setErrors(newErrors);
        setShowError(true);
      })
      .finally(() => {
        setStatus('typing');
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full max-w-sm grid-cols-1 gap-8"
      noValidate
    >
      <Heading>Create your account</Heading>

      {/* Alert placeholder */}
      {showError && errors.size > 0 && (
        <Alert
          data={errors}
          onDismiss={setShowError(false)}
        />
      )}

      {/* Email Field (always shown) */}
      <Field>
        <Label>Email</Label>
        <Input
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
          <Label>Name</Label>
          <Input
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
        <Label>Password</Label>
        <Input
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
          <Label>Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            invalid={errors.has('confirmPassword')}
            onChange={handleChange}
          />
          {errors.has('confirmPassword') && (
            <ErrorMessage>{errors.get('confirmPassword')}</ErrorMessage>
          )}
        </Field>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={status === 'submitting'}
      >
        {isLogin ? 'Login' : 'Create account'}
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
