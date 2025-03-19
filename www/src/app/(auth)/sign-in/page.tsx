'use client';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from '@tanstack/react-form';
import { ErrorMessage } from '~/components/ui/error-message';
import { signIn } from '~/lib/actions/sign-in.action';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInForm = z.infer<typeof schema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { Field, reset, handleSubmit } = useForm({
    onSubmit: (data) => {
      const payload: SignInForm = {
        email: data.value.email,
        password: data.value.password,
      };
      signIn(payload);
      reset();
    },
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: schema,
    },
  });

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex items-center justify-center rounded-md">
                    <Icon
                      icon="solar:bolt-bold-duotone"
                      className="text-primary size-20"
                    />
                  </div>
                  <span className="sr-only">Taskerino</span>
                </Link>
                <h1 className="text-xl font-bold">Welcome Back</h1>
                <div className="text-center text-sm">
                  Don't have an account?{' '}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <Field
                  name="email"
                  children={(field) => (
                    <div className="grid gap-3">
                      <Label htmlFor={field.name}>Email</Label>
                      <div className="relative">
                        <Icon
                          icon="solar:letter-bold-duotone"
                          className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2"
                        />
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="email"
                          placeholder="mike@tyson.com"
                          className="pl-10"
                          required
                        />
                      </div>
                      {field.state.meta.isTouched &&
                      field.state.meta.isBlurred &&
                      field.state.meta.errors.length ? (
                        <ErrorMessage
                          message={field.state.meta.errors[0]?.message!}
                        />
                      ) : null}
                    </div>
                  )}
                />
                <Field
                  name="password"
                  children={(field) => (
                    <div className="grid gap-3">
                      <Label htmlFor={field.name}>Password</Label>
                      <div className="relative">
                        <Icon
                          icon="solar:lock-password-bold-duotone"
                          className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2"
                        />
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="********"
                          className="pr-10 pl-10"
                          required
                        />
                        <button
                          className="absolute top-1/2 right-0 size-8 -translate-y-1/2"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon
                            icon={
                              showPassword
                                ? 'solar:eye-closed-bold-duotone'
                                : 'solar:eye-bold-duotone'
                            }
                            className="text-muted-foreground size-5"
                          />
                        </button>
                      </div>
                      {field.state.meta.isTouched &&
                      field.state.meta.isBlurred &&
                      field.state.meta.errors.length ? (
                        <ErrorMessage
                          message={field.state.meta.errors[0]?.message!}
                        />
                      ) : null}
                    </div>
                  )}
                />
                <div className="text-right text-sm">
                  <Link
                    href="/forgot-password"
                    className="underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  Or
                </span>
              </div>
              <div className="grid">
                <Button variant="outline" type="button" className="w-full">
                  <Icon icon="akar-icons:google-fill" className="size-5" />
                  Continue with Google
                </Button>
              </div>
            </div>
          </form>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
