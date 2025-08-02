'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { OctagonAlertIcon, Loader2 } from 'lucide-react' // Optional spinner icon
import { Alert, AlertTitle } from '@/components/ui/alert'
import Image from 'next/image'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Form validation schema using Zod
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const SignInView = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null)
    setPending(true)

    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setPending(false)
          router.push('/')
        },
        onError: ({ error }) => {
          setError(error.message)
          setPending(false) // ✅ Fix: Reset pending when login fails
        }
      }
    )
  }

  return (
    <div className='flex flex-col gap-8 p-4 md:p-8'>
      <Card className='overflow-hidden p-0 shadow-md rounded-2xl'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          {/* Left: Sign-in form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-10'>
              {/* Optional: disable all fields while pending */}
              <fieldset disabled={pending} className='flex flex-col gap-6'>

                {/* Welcome Message */}
                <div className='flex flex-col items-center text-center gap-1'>
                  <h1 className='text-2xl font-bold'>Welcome back</h1>
                  <p className='text-muted-foreground text-balance'>Login to your account</p>
                </div>

                {/* Email Field */}
                <div className='grid gap-2'>
                  <FormField control={form.control} name='email' render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder='xyz@example.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Password Field */}
                <div className='grid gap-2'>
                  <FormField control={form.control} name='password' render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type='password' placeholder='**********' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Error Alert */}
                {!!error && (
                  <Alert className='bg-destructive/10 border-none'>
                    <OctagonAlertIcon className='h-4 w-4 !text-destructive' />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                {/* Submit Button with Loading State */}
                <Button disabled={pending} type='submit' className='w-full cursor-pointer flex items-center justify-center gap-2'>
                  {pending && <Loader2 className="h-4 w-4 animate-spin" />} {/* Optional spinner */}
                  {pending ? 'Signing in...' : 'Sign in'}
                </Button>

                {/* Separator */}
                <div className='relative text-center text-sm'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-border' />
                  </div>
                  <span className='relative z-10 bg-background px-2 text-muted-foreground'>
                    Or continue with
                  </span>
                </div>

                {/* OAuth Buttons (Optional, disabled while pending) */}
                <div className='grid grid-cols-2 gap-4'>
                  <Button disabled={pending} type='button' variant='outline' className='w-full cursor-pointer'>
                    {/* <Image src="/google.svg" alt="Google" width={20} height={20} className='mr-2' /> */}
                    Google
                  </Button>
                  <Button disabled={pending} type='button' variant='outline' className='w-full cursor-pointer'>
                    {/* <Image src="/github.svg" alt="GitHub" width={20} height={20} className='mr-2' /> */}
                    GitHub
                  </Button>
                </div>

                {/* Sign Up Link */}
                <div className='text-center text-sm'>
                  Don&apos;t have an account?{' '}
                  <Link href='/sign-up' className='underline underline-offset-4'>Sign up</Link>
                </div>
              </fieldset>
            </form>
          </Form>

          {/* Right: Branding Panel (hidden on small screens) */}
          <div className='bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center p-8'>
            <Image src="/logo.svg" alt="Logo" width={92} height={92} className='h-[92px] w-[92px]' />
            <p className='text-2xl font-semibold text-white'>CoretxtMeet.ai</p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className='text-muted-foreground center text-xs text-balance text-center space-y-2 *:[a]:underline *:[a]:underline-offset-4'>
        <p>
          By signing in, you agree to our{' '}
          <Link href='#'>Terms of Service</Link> and{' '}
          <Link href='/privacy'>Privacy Policy</Link>.
        </p>
        <p>
          Need help? <Link href='#'>Contact support</Link>.
        </p>
      </div>
    </div>
  )
}

export default SignInView
