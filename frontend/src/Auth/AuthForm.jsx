import { Button } from '@components/button';
import { ErrorMessage, Field, Label } from '@components/fieldset';
import { Heading } from '@components/heading';
import { Input } from '@components/input';
import { Link } from '@components/link';
import { Strong, Text } from '@components/text';
import { useToast } from '@hooks/toast';
import { getFormErrors, getInputErrors } from '@utils/validation.js';
import { useState } from 'react';
import { Branding } from '@components/branding';

const initialFormData = {
  login: { email: '', password: '' },
  register : { email: '', password: '', name: '', confirmPassword: '' }
}

export default function AuthForm({ isLogin, onSubmit }) {
  const toastify = useToast();
  const [errors, setErrors] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData[isLogin ? 'login' : 'register']);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const newErrors = getInputErrors(name, value, formData, errors);
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // validate the form
    const newErrors = getFormErrors(formData);
    setErrors(newErrors);
    if (newErrors.size > 0) {
      setLoading(false);
      return;
    }

    // send the form data to the server
    onSubmit(formData)
      .then((response) => {
        setFormData(initialFormData[isLogin ? 'login' : 'register']);
        setErrors(new Map());
        toastify.success({ message: response.message, description: response.description });
      })
      .catch((error) => {
        const newErrors = new Map();
        newErrors.set('email', error.data);
        setErrors(newErrors);
        toastify.error({
          message: error.message,
          description: error.description,
        });
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
